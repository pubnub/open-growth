opengrowth.signals.producthunt = ( request ) => {
    const email = 'open-growth-activity@pubnub.com';
    const keywords = request.message.payload.keyword_extraction;
    const url = request.message.payload.url;

    let sendgridPostBody = {
        "signal"       : "producthunt"
      , "message"      : message
      , "email"        : email
      , "name"         : ""
      , "sender_email" : "neumann@pubnub.com"
      , "sender_name"  : "Neumann"
      , "subject"      : "Producthunt Signal"
      , "bccs"         : []
      , "categories"   : [ "producthunt" ]
    }

    keywords.forEach(function(item){
        let companyName = item.keyword;
        let kw = item.keyword.toLowerCase().replace(/[^0-9a-z]/gi, '');
        kvdb.get(kw).then(value => {
            if(value){
                sendgridPostBody.message = "<p>These guys were featured on Producthunt: " + companyName + "</p>"
                + "<p>In article: " +  url + "</p>"
                + "<p>We should email: " + value + "</p>";
                opengrowth.delight.sendgrid.email(sendgridPostBody);
            }
        });
    });
};
