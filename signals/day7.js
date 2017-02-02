opengrowth.signals.day7 = ( request, customer ) => {
    const user = request.message;
    const csm  = user.csm;
    let email  = user.litmus || 'open-growth-activity+testing@pubnub.com';
    // @if GOLD
    email = user.email;
    // @endif

    let salutation = "";
    if ( customer && customer.person && customer.person.name &&
         customer.person.name.givenName ) {
      salutation = customer.person.name.givenName + " - ";
    }
    
    let company_mention = "your company's";
    if ( customer && customer.company &&
         customer.company.name ) { 
      company_mention = "the " + customer.company.name;
    }

    let sendgridPostBody = {
        "signal"        : "day7"
      , "message"       : ""
      , "email"         : email
      , "name"          : ""
      , "sender_email"  : csm.email
      , "sender_name"   : csm.full_name
      , "reply_email"   : csm.email
      , "reply_name"    : csm.full_name
      , "subject"       : "Following up re: PubNub"
      , "bccs"          : csm.bccs || []
      , "categories"    : [ "day7" ]
      , "template_id"   : "9bc6db92-80df-43be-8fa0-8f9f5e34f50f"
      , "substitutions" : {
            "-salutation-"      : salutation
          , "-csm_first_name-"  : csm.first_name
          , "-company_mention-" : company_mention
        }
    }

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(sendgridPostBody);
};
