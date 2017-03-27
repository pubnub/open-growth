opengrowth.signals.presence = ( request, customer ) => {
    const user = request.message;
    const csm  = user.csm || {};
    const csm_bccs = csm && csm.bccs ? csm.bccs : [];
    let email  = user.litmus || 'open-growth-activity+silver@pubnub.com';
    // @if GOLD
    email = user.email;
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
      , "csm_sf_bcc"          : csm_bccs
      , "app_name"            : user.app_name
    };

    var sendWithUsPostBody = {
      "template": opengrowth.keys.swu.templates.enable_presence,
      "recipient": {
        "name": firstName,
        "address": email
      },
      "template_data": template_data,
      "bcc": csm_bccs,
      "tags" : [ "og_enable_presence" ],
      "headers" : { "x-smtpapi" : '{\"asm_group_id\":' + sendgrid.group.feature_enable + '}' }
    };

    // Send Email and Track Delight in Librato
    return opengrowth.delight.sendwithus.email(sendWithUsPostBody);
};