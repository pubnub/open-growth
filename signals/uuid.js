opengrowth.signals.uuid = ( request, customer ) => {
    const user = request.message;
    let email  = user.litmus || 'open-growth-activity+testing@pubnub.com';
    // @if GOLD
    email = user.email;
    // @endif

    let name = "";
    if ( customer && customer.person && customer.person.name &&
         customer.person.name.givenName &&
         customer.person.name.givenName !== 'Not Found' &&
         customer.person.name.givenName !== 'null' ) {
      name = customer.person.name.givenName;
    }

    let sendgridPostBody = {
        "signal"       : "uuid"
      , "email"        : email
      , "name"         : ""
      , "sender_email" : "neumann@pubnub.com"
      , "sender_name"  : "Neumann"
      , "reply_email"  : "support@pubnub.com"
      , "reply_name"   : "Support"
      , "bccs"         : []
      , "categories"   : [ "uuid" ]
      , "template_id"   : "bf0bd3c3-ba49-41cb-886e-7c3c95a1a293"
      , "substitutions" : {
            "-name-" : name || "there"
          , "-uuid_count-" : user.uuid_count.toString()
          , "-ip_count-"   : user.ip_count.toString()
        }
    }

    opengrowth.delight.sendgrid.email(sendgridPostBody);
};