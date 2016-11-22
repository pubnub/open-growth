import tc_scrape
import logging
from apscheduler.schedulers.blocking import BlockingScheduler

sched = BlockingScheduler()

# Run tc_scrape.main every hour
#sched.add_job(tc_scrape.main, 'interval', hours=1)
sched.add_job(tc_scrape.main, 'interval', minutes=1)

sched.start()

log = logging.getLogger('apscheduler.executors.default')
log.addHandler(logging.StreamHandler())