opengrowth.signals.feature_enable_handler = ( request, customer ) => {
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
    var display_url  = `https://admin.pubnub.com/#/` + 
      `user/${user.user_id}/account/${user.account_id}` +
      `/app/${user.app_id}/key/${user.key_id}/`;

    if ( !user.user_id || !user.account_id || !user.app_id || !user.key_id ) {
      display_url = null;
    }

    var template_data = {
        "customer_first_name" : firstName
      , "customer_last_name"  : lastName
      , "company_name"        : company_name
      , "csm_first_name"      : csm.first_name
      , "csm_last_name"       : csm.last_name
      , "csm_email"           : csm.email
      , "csm_phone"           : csm.phone
      , "csm_bccs"            : csm_bccs
      , "app_name"            : user.app_name
      , "display_url"         : display_url
    };

    let lw = opengrowth.keys.sendgrid.group.limit_warning;
    let df = opengrowth.keys.sendgrid.group.default;
    let fe = opengrowth.keys.sendgrid.group.feature_enable;
    let ug = opengrowth.keys.sendgrid.group.usage_info;

    let template = "enable_" + user.signal;
    let tag      = "og_" + template;

    var sendWithUsPostBody = {
      "template": opengrowth.keys.swu.templates[template],
      "recipient": {
        "name": firstName,
        "address": email
      },
      "template_data": template_data,
      "bcc": csm_bccs,
      "tags" : [ tag ],
      "headers" : {
        "x-smtpapi" : `{\"asm_group_id\":${fe},\"asm_groups_to_display\": [${lw},${df},${fe},${ug}],\"category\":[\"${tag}\"]}`
      }
    };

    console.log(sendWithUsPostBody);

    // Send Email and Track Delight in Librato
    return opengrowth.delight.sendwithus.email(sendWithUsPostBody);
};

opengrowth.signals.apns               = opengrowth.signals.feature_enable_handler;
opengrowth.signals.history            = opengrowth.signals.feature_enable_handler;
opengrowth.signals.multiplexing       = opengrowth.signals.feature_enable_handler;
opengrowth.signals.presence           = opengrowth.signals.feature_enable_handler;
opengrowth.signals.realtime_analytics = opengrowth.signals.feature_enable_handler;
opengrowth.signals.uls                = opengrowth.signals.feature_enable_handler;
