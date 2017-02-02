opengrowth.signals.day3 = ( request, customer ) => {
    const user = request.message;
    const csm  = user.csm;
    let email  = user.litmus || 'open-growth-activity+testing@pubnub.com';
    // @if GOLD
    email = user.email;
    // @endif

    let subject = "Adding realtime to your app";
    let company = "";
    if ( customer && customer.company &&
         customer.company.name &&
         customer.company.name !== 'Not Found' &&
         customer.company.name !== 'null' ) {
      subject = `${customer.company.name} - adding realtime to your app`;
      company = customer.company.name;
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

    var hasCompany = `On another note, I see that you work at ${company}. ` + 
      `Curious if you or another member of ${company} is ` + 
      `assessing PubNub to power realtime capabilities in your application?`;

    var noCompany = "Curious if you or another member of your company " + 
      "is assessing PubNub to power realtime capabilities in your application?";

    var company_mention = company ? hasCompany : noCompany;

    let sendgridPostBody = {
        "signal"        : "day3"
      , "message"       : ""
      , "email"         : email
      , "name"          : name
      , "sender_email"  : csm.email
      , "sender_name"   : csm.full_name
      , "reply_email"   : csm.email
      , "reply_name"    : csm.full_name
      , "subject"       : subject
      , "bccs"          : csm.bccs || []
      , "categories"    : [ "day3" ]
      , "template_id"   : "ed0bcf03-8afd-413c-b267-adb6abc8001c"
      , "substitutions" : {
            "-personalization-" : personalization
          , "-csm_first_name-"  : csm.first_name
          , "-company_mention-" : company_mention
        }
    }

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(sendgridPostBody);
};
