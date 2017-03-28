opengrowth.signals.upgrade_free = ( request, customer ) => {
    const user = request.message;
    const csm  = user.csm || {};
    const csm_bccs = csm && csm.bccs ? csm.bccs : [];
    let email  = user.litmus || 'open-growth-activity+silver@pubnub.com';
    // @if GOLD
    email = csm.email;
    // @endif

    let firstName    = opengrowth.customer.getFirstName(customer);
    let lastName     = opengrowth.customer.getLastName(customer);
    let company_name = opengrowth.customer.getCompany(customer);

    var template_data = {
        "customer_first_name" : firstName
      , "customer_last_name"  : lastName
      , "company_name"        : company_name
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
        "name": firstName,
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
