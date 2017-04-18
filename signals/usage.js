opengrowth.signals.usage = ( request, customer ) => {
    const user = request.message;
    const csm  = user.csm || {};
    const csm_bccs = csm && csm.bccs ? csm.bccs : [];
    let email  = user.litmus || 'open-growth-activity+silver@pubnub.com';
    // @if GOLD
    //email = user.email;
    // @endif
    
    var template_data = {
        "customer_first_name" : customer.firstName
      , "customer_last_name"  : customer.lastName
      , "company_name"        : customer.company
      , "graph_url"           : user.url
    };

    let lw = opengrowth.keys.sendgrid.group.limit_warning;
    let df = opengrowth.keys.sendgrid.group.default;
    let fe = opengrowth.keys.sendgrid.group.feature_enable;
    let ug = opengrowth.keys.sendgrid.group.usage_info;

    var sendWithUsPostBody = {
      "template": opengrowth.keys.swu.templates.usage,
      "recipient": {
        "name": customer.firstName,
        "address": email
      },
      "template_data": template_data,
      "bcc": csm_bccs,
      "tags" : [ "og_usage" ],
      "headers" : {
        "x-smtpapi" : `{\"asm_group_id\":${lw},\"asm_groups_to_display\": [${lw},${df},${fe},${ug}],\"category\":[\"og_usage\"]}`
      }
    };

    return opengrowth.delight.sendwithus.email(sendWithUsPostBody);
};