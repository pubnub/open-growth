import tc_scrape
import ph_scrape
import logging
from apscheduler.schedulers.blocking import BlockingScheduler

# Write to log on Heroku
logging.basicConfig()

sched = BlockingScheduler()

# Run tc_scrape.main every hour
sched.add_job(tc_scrape.main, 'interval', hours=1)
sched.add_job(ph_scrape.main, 'interval', hours=1)

sched.start()