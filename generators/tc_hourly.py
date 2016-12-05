import tc_scrape
import logging
from apscheduler.schedulers.blocking import BlockingScheduler

# Write to log on Heroku
logging.basicConfig()

sched = BlockingScheduler()

# Run tc_scrape.main every hour
sched.add_job(tc_scrape.main, 'interval', hours=1)

sched.start()