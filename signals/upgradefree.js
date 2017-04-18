opengrowth.signals.upgrade_free = ( request, customer ) => {
    const user = request.message;
    const csm  = user.csm || {};
    const csm_bccs = csm && csm.bccs ? csm.bccs : [];
    let email  = user.litmus || 'open-growth-activity+silver@pubnub.com';
    // @if GOLD
    email = csm.email;
    // @endif
    
    var template_data = {
        "customer_first_name" : customer.firstName
      , "customer_last_name"  : customer.lastName
      , "company_name"        : customer.company
      , "csm_first_name"      : csm.first_name
      , "csm_last_name"       : csm.last_name
      , "csm_email"           : csm.email
      , "csm_phone"           : csm.phone
      , "csm_bccs"            : csm_bccs
      , "customer_email"      : user.email
      , "sub_key"             : user.sub_key
    };
      
    var sendWithUsPostBody = {
      "template": opengrowth.keys.swu.templates.upgrade_free,
      "recipient": {
        "name": customer.firstName,
        "address": email
      },
      "sender": {
        "name": csm.first_name + " " + csm.last_name,
        "address": csm.email,
        "reply_to": csm.email
      },
      "template_data": template_data,
      "tags" : [ "og_upgrade_free" ]
    };

    // Send Email and Track Delight in Librato
    return opengrowth.delight.sendwithus.email(sendWithUsPostBody);
};
