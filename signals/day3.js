opengrowth.signals.day3 = ( request, customer ) => {
    const user = request.message;
    const csm  = user.csm;
    let email  = user.litmus || 'open-growth-activity+testing@pubnub.com';
    // @if GOLD
    email = user.email;
    // @endif

    let subject = "Adding realtime to your app";
    let company_name = "your team";
    if ( customer && customer.company &&
         customer.company.name &&
         customer.company.name !== 'Not Found' &&
         customer.company.name !== 'null' ) {
      company_name = customer.company.name;
      subject = `${company_name} - adding realtime to your app`;
    }

    let company_mention;
    if ( company_name !== "your team" ) {
      company_mention = `On another note, I see that you work at ${company_name}. `;
    }
    else {
      company_mention = "";
    }

    let personalization = ".";
    if ( customer && customer.person && customer.person.name &&
         customer.person.name.givenName &&
         customer.person.name.givenName !== 'Not Found' &&
         customer.person.name.givenName !== 'null' ) {
      personalization = ', ' + customer.person.name.givenName + '.';
    }

    let name = "";
    if ( customer && customer.person && customer.person.name &&
         customer.person.name.fullName &&
         customer.person.name.fullName !== 'Not Found' &&
         customer.person.name.fullName !== 'null' ) {
      name = customer.person.name.fullName;
    }

    let sendgridPostBody = {
        "signal"        : "day3"
      , "message"       : ""
      , "email"         : email
      , "name"          : name
      , "sender_email"  : "neumann@pubnub.com"
      , "sender_name"   : "Neumann"
      , "reply_email"   : "support@pubnub.com"
      , "reply_name"    : "Support"
      , "bccs"          : csm.bccs || []
      , "categories"    : [ "day3" ]
      , "template_id"   : "6b3a9a07-e470-4075-a84b-02087fa99699"
      , "substitutions" : {
            "-name-"              : name || 'there'
          , "-personalization-"   : personalization
          , "-csm_first_name-"    : csm.first_name
          , "-csm_email_address-" : csm.email
          , "-company_mention-"   : company_mention
          , "-company_name-"      : company_name
        }
    }

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(sendgridPostBody);
};
