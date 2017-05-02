opengrowth.signals.block_expiration_handler = ( request, customer ) => {
    const user = request.message;
    const csm  = user.csm || {};
    const csm_bccs = csm && csm.bccs ? csm.bccs : [];
    let email  = user.litmus || 'open-growth-activity+silver@pubnub.com';
    // @if GOLD
    email = user.email;
    // @endif

    let blocks_name_array = [];
    let blocks_url_array = [];
    for ( let block of request.message.blocks ) {
        blocks_name_array.push(`${block.block_name}`);
        blocks_url_array.push(`https://admin.pubnub.com/#/user/` +
          `${block.user_id}/account/${block.account_id}/app/${block.app_id}` +
          `/key/${block.app_key_id}/block/${block.block_id}/event_handlers`);
    }

    var template_data = {
        "customer_first_name" : customer.firstName
      , "customer_last_name"  : customer.lastName
      , "company_name"        : customer.company
      , "csm_first_name"      : csm.first_name
      , "csm_last_name"       : csm.last_name
      , "csm_email"           : csm.email
      , "csm_phone"           : csm.phone
      , "app_name"            : user.app_name
      , "blocks_name_array"   : blocks_name_array //blocks expiring only
      , "blocks_url_array"    : blocks_url_array  //blocks expiring only
    };

    // TODO: Remove x-smtpapi header when New Unsubscribe is complete or SendWithUs is replaced
    let lw = opengrowth.keys.sendgrid.group.limit_warning;
    let df = opengrowth.keys.sendgrid.group.default;
    let fe = opengrowth.keys.sendgrid.group.feature_enable;
    let ug = opengrowth.keys.sendgrid.group.usage_info;

    let template = user.signal;
    let tag      = "og_" + template;

    let xsmtpapi = `{\"asm_group_id\":${lw},\"asm_groups_to_display\": [${lw},${df},${fe},${ug}],\"category\":[\"${tag}\"]}`;

    var sendWithUsPostBody = {
      "template": opengrowth.keys.swu.templates[template],
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

    // Send Email and Track Delight in Librato
    return opengrowth.delight.sendwithus.email(sendWithUsPostBody);
};

opengrowth.signals.block1day    = opengrowth.signals.block_expiration_handler;
opengrowth.signals.block3day    = opengrowth.signals.block_expiration_handler;
opengrowth.signals.blockexpired = opengrowth.signals.block_expiration_handler;
