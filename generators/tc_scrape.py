# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
# Libs
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
import re
import json
import uuid
import feedparser
import urllib
import HTMLParser
import cfg
from monkeylearn import MonkeyLearn
from pubnub import Pubnub
from peewee import *


# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
# Writes new articles to DB
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
def db_bulk_upsert(items):
    with cfg.db.atomic():
        cfg.Article.insert_many(items).upsert(upsert=True).execute()


# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
# Makes a list of the new articles that have not yet been processed
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
def get_new_articles():
    print "getting new articles"
    # Get the RSS feed's XML. Stop executing if there is no connection.
    try:
        xml = feedparser.parse('http://feeds.feedburner.com/TechCrunch/')
    except:
        print 'exiting'
        exit()
    print 'got xml'
    new_articles = []
    for article_url in xml.entries:
        new_articles.append(article_url)

    # Get a list of articles we have already analyzed
    old_articles = cfg.Article.select()
    print "got old articles"
    for article in old_articles:
        if article.url not in [a.id for a in new_articles]:
            # Remove expired articles from DB (if no longer in rss feed)
            q = cfg.Article.delete().where(cfg.Article.url == article.url)
            q.execute()
        else:
            # Remove already analyzed articles from the list to be analyzed
            new_articles = [a for a in new_articles if a.id != article.url]
    print "returning new articles"
    return new_articles


# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
# Scrapes the text contents out of each article that will be analized
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
def get_article_contents(new_articles):
    print "getting article contents"
    article_dicts_list = []
    for article_xml in new_articles:
        opener = urllib.FancyURLopener({})
        article_url = article_xml.id

        # skip if the post is not a text article
        if re.search('http:\/\/techcrunch\.com\/\?p=', article_url) == None:
            continue

        # gets the raw html for the first article in the feed
        s = opener.open(article_url).read()

        # reduce the raw html of the whole page to only the article content
        content_re = '<!-- Begin: Wordpress Article Content -->' \
            '([\S\s]*)' \
            '<!-- End: Wordpress Article Content -->'
        result = re.search(content_re, s).group(0)

        # remove the 'related articles' div from the article content
        aside_re = '<div class="aside aside-related-articles">' \
            '([\S\s]*[^>])' \
            '<\/div>'
        result = re.sub(aside_re, '', result)

        # remove any asides or scripts
        result = re.sub('<aside([\S\s]*)<\/aside>', '', result)
        result = re.sub('<script([\S\s]*)<\/script>', '', result)

        # remove all html tags leaving only the plain text of the article
        result = re.sub('<[^>]*>', '', result)

        # convert all html codes to plain text
        result = HTMLParser.HTMLParser().unescape(result.decode('utf8'))

        # keep data to store in DB after all articles are analyzed
        url_id_re = '[^http://techcrunch.com/?p=](.*)'
        url_id = re.search(url_id_re, article_url).group(0)
        article_dicts_list.append({
            "id": url_id,
            "url": article_url,
            "content": result.encode('utf8').decode('utf8')
        })

    print "returning article contents"
    return article_dicts_list


# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
# Make a list of only texts from new articles
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
def listify_article_texts(article_dicts_list):
    texts = []
    for article in article_dicts_list:
        texts.append(article['content'])
    return texts


# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
# Extract keywords and get sentiment analysis of new articles with MonkeyLearn
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
def monkey_learn(texts, article_dicts_list):
    print "monkeylearning"
    if not texts:
        return None

    ml = MonkeyLearn(cfg.MONKEYLEARN_TOKEN)

    # keyword extraction
    extraction = ml.extractors.extract(
        'ex_y7BPYzNG',
        texts,
        use_company_names=1,
        max_keywords=3
    )

    # sentiment analysis
    classification = ml.classifiers.classify('cl_MX2qQKNi', texts)

    ml_results = []

    for i in range(0, len(extraction.result)):
        ml_result = {
            "id": article_dicts_list[i]['id'],
            "classification": classification.result[i],
            "keyword_extraction": extraction.result[i]
        }

        ml_results.append(json.dumps(ml_result, separators=(',', ': ')))

    # Return a list of JSON strings of results, 1 string per article
    return ml_results


# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
# Publish Js objects of analysis results for new articles, 1 by 1, to PubNub
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
def pn_publish(ml_results):
    print "pn publishing"
    if not ml_results:
        return

    pn = Pubnub(publish_key=cfg.PN_PUB, subscribe_key=cfg.PN_SUB)

    for result in ml_results:
        pn.publish(channel=cfg.PN_CHANNEL, message=result)


def main():
    print "main ing"
    # Get all newly published articles since last scrape
    new_articles = get_new_articles()

    # Extract and format article Ids, URLS, and contents.
    article_dicts_list = get_article_contents(new_articles)

    # Get a list of article texts from the dictionaries
    texts = listify_article_texts(article_dicts_list)

    # Extract Keywords and get Sentiment Analysis
    ml_results = monkey_learn(texts, article_dicts_list)

    # Publish the ML results to PubNub BLOCK
    pn_publish(ml_results)

    # add newly analyzed articles to DB
    if article_dicts_list:
        db_bulk_upsert(article_dicts_list)
    print "donezo"
