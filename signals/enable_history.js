opengrowth.signals.history = ( request, customer ) => {
    const email = request.message.litmus || 'open-growth-activity@pubnub.com';//request.message.email

    let sendgridPostBody = {
        "signal"       : "features"
      , "message"      : ""
      , "email"        : email
      , "name"         : ""
      , "sender_email" : "neumann@pubnub.com"
      , "sender_name"  : "Neumann"
      , "reply_email"  : "neumann@pubnub.com"
      , "reply_name"   : "Neumann"
      , "subject"      : "You enabled History!"
      , "bccs"         : []
      , "categories"   : [ "enable_history" ]
    }
    
    try { sendgridPostBody.name = customer.person.name.givenName }
    catch(e) { sendgridPostBody.name = null }

    sendgridPostBody.message = `<p>Hey ${sendgridPostBody.name || 'there'},</p>` +
        `<p>I noticed that you enabled History in your ${request.message.app_name} app.</p>` +
        `<p>Information about how to use History can be found <a href='http://lmgtfy.com/?q=pubnub+history'>here</a></p>` + 
        `<p>Good luck,<br />Neumann</p>`; 

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(sendgridPostBody);
};
