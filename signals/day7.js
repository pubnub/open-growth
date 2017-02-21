opengrowth.signals.day7 = ( request, customer ) => {
    const user = request.message;
    const csm  = user.csm;
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
    
    let company_name = "your engineering"
    let company_mention = "your company's";
    if ( customer && customer.company &&
         customer.company.name ) {
      company_name = "the " + customer.company.name + "engineering";
      company_mention = "the " + customer.company.name;
    }

    let sendgridPostBody = {
        "signal"        : "day7"
      , "message"       : ""
      , "email"         : email
      , "name"          : name
      , "sender_email"  : "neumann@pubnub.com"
      , "sender_name"   : "Neumann"
      , "reply_email"   : "support@pubnub.com"
      , "reply_name"    : "Support"
      , "bccs"          : csm.bccs || []
      , "categories"    : [ "day7" ]
      , "template_id"   : "3651fe4d-ec21-4bf8-aee3-de87836bf38d"
      , "substitutions" : {
            "-name-"            : name || 'there'
          , "-csm_first_name-"  : csm.first_name
          , "-company_mention-" : company_mention
          , "-company_name-"    : company_name
        }
    }

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(sendgridPostBody);
};
