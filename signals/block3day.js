opengrowth.signals.block3day = ( request, customer ) => {
    const user = request.message;
    let email  = 'open-growth-activity@pubnub.com';
    // @if GOLD
    email = user.email;
    // @endif
    
    let name = "";
    try       { name = customer.person.name.givenName }
    catch (e) { name = null }
    if ( name == 'Not Found' ) { name = null }

    let message = 
        `<p>Hi ${name || 'there'},</p>` + 
        `<p>I noticed you have one or more blocks that will expire in 3 days. We have a 30 day limit on running blocks in the FREE tier. You can upgrade your usage plan to keep blocks running continuously.</p>` +
        `<p>It will be really sad if your workflow gets disrupted.</p>` +
        `<p>It’s really easy to fix, just follow the links and restart your blocks:</p>`;

    message += '<ul>';
    for ( let block of request.message.blocks ) {
        message += `<li><a href='https://admin.pubnub.com/#/user/${block.user_id}/account/${block.account_id}/app/${block.app_id}/key/${block.app_key_id}/block/${block.block_id}/event_handlers?link=block</li>'>${block.block_name}</a>`;
    }
    message += '</ul>';

    message += `<p>Need help? <a href='mailto:support@pubnub.com'>Contact support</a> anytime.</p>` +
        `<p>Happy coding,<br>` +
        `Neumann</p>`;

    let sendgridPostBody = {
        "signal"       : "block3day"
      , "message"      : message
      , "email"        : email
      , "name"         : ""
      , "sender_email" : "neumann@pubnub.com"
      , "sender_name"  : "Neumann"
      , "reply_email"  : "support@pubnub.com"
      , "reply_name"   : "Support"
      , "subject"      : "PubNub Block Expiring"
      , "bccs"         : user.csm.bccs || []
      , "categories"   : [ "block3day" ]
    }

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(sendgridPostBody);
};
