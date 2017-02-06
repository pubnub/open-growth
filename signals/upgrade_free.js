opengrowth.signals.upgrade_free = ( request, customer ) => {
    const user = request.message;
    const csm  = user.csm;
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
        "signal"        : "upgrade_free"
      , "email"         : email
      , "name"          : name
	  , "sender_email"  : csm.email
      , "sender_name"   : csm.full_name
      , "reply_email"   : csm.email
      , "reply_name"    : csm.full_name
      , "subject"       : "Upgrade Required"
      , "bccs"          : csm.bccs || []
      , "categories"    : [ "upgrade_free" ]
      , "template_id"   : "a1b59a4f-75d2-4b38-9fa9-8d52baf0b93d"
      , "substitutions" : {
            "-salutation-" : name || "Hello"
          , "-csm_name-"   : csm.first_name
        }
    };

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(sendgridPostBody);
};
