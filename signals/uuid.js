opengrowth.signals.uuid = ( request, customer ) => {
    const user = request.message;
    const csm  = user.csm || {};
    const csm_bccs = csm && csm.bccs ? csm.bccs : [];
    let email  = user.litmus || 'open-growth-activity+silver@pubnub.com';
    // @if GOLD
    email = user.email;
    // @endif
    
    let uuid_count   = user.uuid_count || "0";
    let ip_count     = user.ip_count || "0";

    var template_data = {
        "customer_first_name" : customer.firstName
      , "customer_last_name"  : customer.lastName
      , "company_name"        : customer.company
      , "csm_first_name"      : csm.first_name
      , "csm_last_name"       : csm.last_name
      , "csm_email"           : csm.email
      , "csm_phone"           : csm.phone
      , "csm_bccs"            : csm_bccs
      , "app_name"            : user.app_name
      , "uuid_count"          : uuid_count.toString()
      , "ip_count"            : ip_count.toString()
    };

    // TODO: Remove x-smtpapi header when New Unsubscribe is complete or SendWithUs is replaced
    let lw = opengrowth.keys.sendgrid.group.limit_warning;
    let df = opengrowth.keys.sendgrid.group.default;
    let fe = opengrowth.keys.sendgrid.group.feature_enable;
    let ug = opengrowth.keys.sendgrid.group.usage_info;

    let template = user.signal;
    let tag      = "og_" + template;

    let xsmtpapi = `{\"asm_group_id\":${fe},\"asm_groups_to_display\": [${lw},${df},${fe},${ug}],\"category\":[\"${tag}\"]}`;

    var sendWithUsPostBody = {
      "template": opengrowth.keys.swu.templates.uuid,
      "recipient": {
        "name": customer.firstName,
        "address": email
      },
      "template_data": template_data,
      "bcc": csm_bccs,
      "tags" : [tag],
      "headers" : {
        "x-smtpapi" : xsmtpapi
      }
    };

    return opengrowth.delight.sendwithus.email(sendWithUsPostBody);
};
