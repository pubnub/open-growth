opengrowth.signals.signup = ( request, customer ) => {
    const user = request.message;
    const csm_bccs = user.csm && user.csm.bcc ? user.csm.bcc : [];
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

    let display_url = `https://admin.pubnub.com/#/user/${user.user_id}/` +
                      `account/${user.account_id}/` +
                      `app/${user.app_id}/key/${user.key_id}/`;
    let anchor_url  = display_url +
                      `?utm_source=EmailBlasts%20&utm_medium=` +
                      `Open-Growth&utm_campaign=` +
                      `EB-CY16-Q4-Open-Growth-01&utm_term=link2` +
                      `&utm_content=api-keys&signal=signup&link=keys`;

    var sendgridPostBody = {
        "signal"        : "signup"
      , "email"         : email
      , "name"          : name
      , "sender_email"  : "neumann@pubnub.com"
      , "sender_name"   : "Neumann"
      , "reply_email"   : "support@pubnub.com"
      , "reply_name"    : "Support"
      , "subject"       : "Your PubNub API Keys"
      , "bccs"          : csm_bccs
      , "categories"    : [ "signup" ]
      , "template_id"   : "8c2c3be2-afc2-4d72-85b8-5304b9421ff3"
      , "substitutions" : {
            "-name-"        : name || 'there'
          , "-display_url-" : display_url
          , "-anchor_url-"  : anchor_url
        }
    }

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(sendgridPostBody);
};
