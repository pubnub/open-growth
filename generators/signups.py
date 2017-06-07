## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
## Libs
## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
import json
import librato
import urllib
import pymysql

## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
## Globals
## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
db     = "" ## connection to your db
pubkey = "" ## Publish key for your Open Growth keyset
subkey = "" ## Subscribe key for your Open Growth keyset

## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
## Main - get latest sign ups from the past 10 minutes
## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
def main():
    since = 10 ## minutes
    customers = signups(since)

    ## Librato
    record( 'opengrowth.generators.signup', count )

    ## Publish Signals
    for customer in customers:
        customer['signal'] = 'signup'
        ## publish a sign up signal to PubNub Open Growth
        publish( 'opengrowth.signals', customer )

## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
## Get new sign ups data from your customer DB
## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
def signups( since ):
    query = """
        SELECT
            User.id,
            User.email
            User.created
        FROM
            mydb.user User
        WHERE
            User.created >= NOW() - INTERVAL '%(m)s' MINUTE
        ORDER BY User.created DESC
    """ % { "m" : since }

    record( 'opengrowth.generators.queries', 1 )
    return querydbs( db, query )

## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
## Easy Librato real-time monitoring
## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
def record( metric, value ):
    libratoapi = librato.connect(
        ## librato email here
    ,   ## librato token here
    )

    gauge = metric

    libratoapi.submit(
        gauge
    ,   value
    ,   description="Open Growth Signals Generator Source"
    )

## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
## Easy PubNub Publish
## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
def publish( channel, message={} ):
    ## Create URL for REST API
    url = 'https://' + '/'.join([
        'pubsub.pubnub.com'
    ,   'publish'
    ,   pubkey
    ,   subkey
    ,   '0'
    ,   urllib.quote(channel)
    ,   '0'
    ,   urllib.quote(json.dumps(message))])

    ## Pubish Data
    return http(url)

## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
## Easy HTTP Fetcher
## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
def http( url, data=None ):
    try:    return urllib.urlopen( url, data ).read()
    except: return None

## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
## Query DB Connections
## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
def querydbs( db, query ):
    cursor = db.cursor(pymysql.cursors.DictCursor)
    cursor.execute(query)

    try:    return cursor.fetchall()
    except: return None

## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
## Run Main if Main
## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
if __name__ == '__main__':
    main()
