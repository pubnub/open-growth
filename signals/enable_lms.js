opengrowth.signals.lms = ( request, customer ) => {
    const user = request.message;
    let email  = user.litmus || 'open-growth-activity+testing@pubnub.com';
    // @if GOLD
    //email = user.email;
    // @endif

    let name = "";
    if ( customer && customer.person && customer.person.name &&
         customer.person.name.givenName &&
         customer.person.name.givenName !== 'Not Found' &&
         customer.person.name.givenName !== 'null' ) {
      name = customer.person.name.givenName;
    }

    let sendgridPostBody = {
        "signal"       : "features"
      , "email"        : email
      , "name"         : name
      , "sender_email" : "neumann@pubnub.com"
      , "sender_name"  : "Neumann"
      , "reply_email"  : "neumann@pubnub.com"
      , "reply_name"   : "Neumann"
      , "bccs"         : []
      , "categories"   : [ "enable_lms" ]
      , "template_id"   : "80dea1cc-451a-4ff9-ba48-396ea61abd3b"
      , "substitutions" : {
            "-salutation-" : name || "there"
          , "-app_name-"   : user.app_name
        }
    };

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(sendgridPostBody);
};
