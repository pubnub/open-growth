opengrowth.signals.block1day = ( request, customer ) => {
    const user = request.message;
    const csm_bccs = user.csm && user.csm.bccs ? user.csm.bccs : [];
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

    let url_list = "";
    for ( let block of request.message.blocks ) {
        url_list += `<a href='https://admin.pubnub.com/#/user/${block.user_id}/` +
          `account/${block.account_id}/app/${block.app_id}/key/${block.app_key_id}/` +
          `block/${block.block_id}/event_handlers?link=block'>${block.block_name}</a><br />`;
    }

    let sendgridPostBody = {
        "signal"       : "block1day"
      , "email"        : email
      , "name"         : ""
      , "sender_email" : "neumann@pubnub.com"
      , "sender_name"  : "Neumann"
      , "reply_email"  : "support@pubnub.com"
      , "reply_name"   : "Support"
      , "bccs"         : csm_bccs
      , "categories"   : [ "block1day" ]
      , "template_id"   : "67f64bfe-77c1-44cc-9667-b29cf73332bc"
      , "substitutions" : {
            "-salutation-" : name || "there"
          , "-url_list-"   : url_list
        }
    }

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(sendgridPostBody);
};
