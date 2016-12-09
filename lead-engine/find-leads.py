## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
## Libs
## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
import json
import clearbit

## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
## Runstate
## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
run = {
    'emails'  : {}
,   'metrics' : {
        'companies'   : 0
    ,   'prospects'   : 0
    ,   'enrichments' : 0
    }
}

## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
## Main
## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
def main():
    config       = loadjson('./../keys.json')
    clearbit.key = config['clearbit']['apikey']

    ## Find Companies
    for company in discovery({'country':'US'}):
        print(company)

        ## Find Prospects
        for prospect in prospector( company['domain'], 'Software' ):
            print(prospect)

    ## Print Result Metrics
    print( 'Totals: ', run['metrics'] )

## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
## Discovery: Get Company Names
## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
def discovery( query, page=0 ):
    limit = 0
    count = 0

    ## Get all Companies
    while not limit or limit == count:
        page += 1
        companies = clearbit.Discovery.search(
            query=query
        ,   sort='alexa_asc'
        ,   page=page
        )

        ## Get Results Count
        count = len(companies['results'])

        ## Yield Companies One-by-One
        for company in companies['results']: 
            run['metrics']['companies'] += 1
            yield company

        ## Continue Collecting Companies
        if not limit: limit = count or 10

## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
## Prospector: Find Target Customers
## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
def prospector( domain, title, page=1 ):
    limit = 0
    count = 0

    ## Get all Prospects
    while not limit or limit == count:
        page += 1
        prospects = clearbit.Prospector.search(
            domain=domain
        ,   query=title
        ,   email=True
        ,   limit=100
        ,   page=page
        )

        ## Yield Companies One-by-One
        count = 0
        for prospect in prospects: 
            count += 1
            if prospect['email'] in run['emails']: 
                count = 0
                break
            run['emails'][prospect['email']] = 1
            run['metrics']['prospects'] += 1
            yield prospect

        ## Continue Collecting Companies
        if not limit: limit = count or 10

## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
## Enrichment: Get Person
## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
def enrichment( email ):
    person = clearbit.Enrichment.find( email=email, stream=True )
    run['metrics']['enrichments'] += 1
    return person

## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
## Load JSON File
## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
def loadjson(filename):
    with open( filename, 'r' ) as fh: return json.loads(fh.read())

## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
## If Main
## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
if __name__ == '__main__': 
    try                                      : main()
    except ( KeyboardInterrupt, SystemExit ) : print('\nGoodbye!\n')
