opengrowth.signals.producthunt = ( request ) => {
    const recipient = 'open-growth-activity@pubnub.com';
    const subject = 'Producthunt Signal';
    const keywords = request.message.payload.keyword_extraction;
    const url = request.message.payload.url;

    keywords.forEach(function(item){
        let companyName = item.keyword;
        let kw = item.keyword.toLowerCase().replace(/[^0-9a-z]/gi, '');
        kvdb.get(kw).then(value => {
            if(value){
                var message ="<p>These guys were featured on Producthunt: " + companyName + "</p>"
                + "<p>In article: " +  url + "</p>"
                + "<p>We should email: " + value + "</p>";
                opengrowth.delight.sendgrid.email(
                    'producthunt', message, recipient, companyName, subject
                );
            }
        });
    });
};
