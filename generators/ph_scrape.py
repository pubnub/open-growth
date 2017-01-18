import feedparser
import hashlib
import json
import cfg
from time import gmtime, strftime
from monkeylearn import MonkeyLearn
from pubnub import Pubnub

product_hunt_rss = 'https://www.producthunt.com/feed.atom'

# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
# Creates a list of article titles in the Product Hunt RSS feed
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
def get_entries(xml):
	titles = []
	urls = []

	for entry in xml.entries:
		titles.append(entry.title)
		urls.append(entry.link)

	return [titles, urls]


# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
# Extract keywords of new articles with MonkeyLearn
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
def monkey_learn(titles, urls):
    if not titles and urls:
        return None

    ml = MonkeyLearn(cfg.MONKEYLEARN_TOKEN)

    # keyword extraction
    extraction = ml.extractors.extract(
        'ex_y7BPYzNG',
        titles,
        use_company_names=1,
        max_keywords=10
    )

    ml_results = []

    for i in range(0, len(extraction.result)):
        ml_result = {
        	"id": str(hashlib.md5(titles[i].encode('utf8')).hexdigest()),
        	"url": urls[i],
            "keyword_extraction": extraction.result[i]
        }

        # remove keyword position indicies
        for kw in ml_result['keyword_extraction']:
            if kw.get('positions_in_text'):
                del kw['positions_in_text']
        print ml_result
        # convert dictionaries to JSON strings
        ml_results.append(json.dumps(ml_result, separators=(',', ': ')))

    # Return a list of JSON strings of results, 1 string per article
    return ml_results


# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
# Publish Js objects of analysis results for new articles, 1 by 1, to PubNub
# =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
def pn_publish(message):
    if not message:
        return

    pn = Pubnub(publish_key=cfg.PUBKEY, subscribe_key=cfg.SUBKEY)
    pn.publish(channel=cfg.OGCHAN, message=message)


def publish_signal(ml_results):
    # Publish to BLOCK each iteration for debugging
    try: result_count = len(ml_results)
    except: result_count = None
    current_time = strftime("%Y-%m-%d %H:%M:%S:GMT", gmtime())
    block_log = "Product Hunt Scrape: " + \
        str(result_count) + " articles " + current_time
    pn_publish(block_log)

    if not ml_results:
        return

    for result in ml_results:
        pn_publish({
            "signal": "producthunt",
            "payload": result
        })


def main():
	try:
	    xml = feedparser.parse(product_hunt_rss)
	except:
	    exit()

	entries = get_entries(xml)

	ml_results = monkey_learn(entries[0], entries[1])

	publish_signal(ml_results)
