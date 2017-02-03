opengrowth.signals.test = ( request, customer ) => {
    console.log('******TESTING******');
    console.log(request.message);
    console.log(customer);

    const message = JSON.stringify(request.message);
    const email = 'open-growth-activity+testing@pubnub.com';
    const name = "Neumann";
    const sender_email = "neumann@pubnub.com";
    const sender_name = "Neumann";
    const reply_email = "neumann@pubnub.com";
    const reply_name = "Neumann";
    const subject = "this is a test";
    const categories = ['testing'];

    var sendgridPostBody = {
        "signal"       : "test"
      , "email"        : email
      , "message"      : message
      , "name"         : name
      , "sender_email" : sender_email
      , "sender_name"  : sender_name
      , "reply_email"  : reply_email
      , "reply_name"   : reply_name
      , "subject"      : subject
      , "categories"   : categories
    }

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(sendgridPostBody);
};
