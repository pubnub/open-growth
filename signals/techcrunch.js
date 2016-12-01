opengrowth.signals.techcrunch = ( request ) => {
    const recipient = 'open-growth-activity@pubnub.com';
    const subject = 'Techcrunch Signal';
    const message = '';
    const keywords = request.message.keyword_extraction;
    
    for (var item in keywords){
	kvdb.get(item.keyword.toLowerCase().replace(/[^0-9a-z]/gi, '')).then(val => {
            if (val) {
	        message = "These guys were in the news: " + companyName + "\n\nWe should email: " + val;
	        opengrowth.delight.sendgrid.email(
	            'techcrunch', message, recipient, companyName, subject
                );
            }
        });
    }
};
