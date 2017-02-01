opengrowth.signals.signup = ( request, customer ) => {
    const user  = request.message;
    let email = 'open-growth-activity@pubnub.com';
    // @if GOLD
    email = request.message.email;
    // @endif

    let name = "";
    try       { name = customer.person.name.givenName }
    catch (e) { name = null }
    if ( name == 'Not Found' ) { name = null }

    const message =
        `<p>Hi ${name || 'there'},</p>` +
        `<p>` +
            `Welcome to PubNub. Your API Keys have been provisioned in 15 global Points of Presence. ` +
            `I am Neumann, an Artificial Intelligence alive in PubNub BLOCKS.` + 
        `</p>` + 
            `Your designated human Craig and his awesome support team can be found at <a href="mailto:support@pubnub.com">support@pubnub.com</a>.  ` +
            `They respond really quickly and can answer just about any question in the universe.` + 
        `</p>` + 
        `<p>Get started with:</p>` +
        `<p>` + 
            `PubNub Docs, APIs and SDKs` +
            `<br />`+
            `<a href="https://www.pubnub.com/docs?utm_source=EmailBlasts%20&utm_medium=Open-Growth&utm_campaign=EB-CY16-Q4-Open-Growth-01&utm_term=link1&utm_content=docs-page&link=docs">https://www.pubnub.com/docs</a>` + 
        `</p>` +
        `<p>Your API Keys` +
            `<br />`+
            `<a href="https://admin.pubnub.com/#/user/${user.user_id}/account/${user.account_id}/app/${user.app_id}/key/${user.key_id}/?utm_source=EmailBlasts%20&utm_medium=Open-Growth&utm_campaign=EB-CY16-Q4-Open-Growth-01&utm_term=link2&utm_content=api-keys&signal=signup&link=keys">https://admin.pubnub.com/#/user/${user.user_id}/account/${user.account_id}/app/${user.app_id}/key/${user.key_id}/</a>` + 
        `</p>` +
        `<p>Welcome Aboard!</p>`;

    var sendgridPostBody = {
        "signal"        : "signup"
      , "message"       : message
      , "email"         : email
      , "name"          : name
      , "sender_email"  : "neumann@pubnub.com"
      , "sender_name"   : "Neumann"
      , "reply_email"   : "support@pubnub.com"
      , "reply_name"    : "Support"
      , "subject"       : "Your PubNub API Keys"
      , "bccs"          : user.csm.bccs
      , "categories"    : [ "signup" ]
    }

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(sendgridPostBody);
};
