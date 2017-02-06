opengrowth.signals.multiplexing = ( request, customer ) => {
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
      , "categories"   : [ "enable_multiplexing" ]
      , "template_id"   : "76eaa940-0859-4ba7-a0e7-c3ebf97de79e"
      , "substitutions" : {
            "-salutation-" : name || "there"
          , "-app_name-"   : user.app_name
        }
    };

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(sendgridPostBody);
};
