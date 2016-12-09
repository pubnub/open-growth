## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
## LeadEngine
## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
"""LeadEngine Usage

Usage:
  find-leads.py [--title=TITLE] [--country=COUNTRY]

Options:
  -h --help        Show this screen.
  --title=<name>   Job Role Title of Prospects to Find [default: Software]
  --country=<name> Name of Country to Search [default: US]

"""

## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
## Libs
## =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
import json
import clearbit
from docopt import docopt

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
def main(args):
    config       = loadjson('./../keys.json')
    clearbit.key = config['clearbit']['apikey']

    ## Find Companies
    for company in discovery({ 'country' : args['--country'] or 'US' }):
        ##print(json.dumps(company))

        ## Find Prospects
        for prospect in prospector(
            company['domain']
        ,   args['--title'] or 'Software'
        ): print(json.dumps(prospect))

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
def prospector( domain, title ):
    ## Get as many Prospects as possible
    try:
        prospects = clearbit.Prospector.search(
            domain=domain
        ,   query=title
        ,   email=True
        ,   limit=20
        )
    except: prospects = []

    ## Yield Companies One-by-One
    for prospect in prospects: 
        if prospect['email'] in run['emails']: break
        run['emails'][prospect['email']] = 1
        run['metrics']['prospects'] += 1
        yield prospect

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
    args = docopt( __doc__, version='LeadEngine 1.0' )
    try: main(args)
    except ( KeyboardInterrupt, SystemExit ):
        print("\nGoodbye!\n")
        print(run['metrics'] )
