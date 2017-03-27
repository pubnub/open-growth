opengrowth.signals.blockexpired = ( request, customer ) => {
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
      , "app_name"            : user.app_name
      , "blocks_name_array"   : blocks_name_array //blocks expiring only
      , "blocks_url_array"    : blocks_url_array  //blocks expiring only
    };

    var sendWithUsPostBody = {
      "template": opengrowth.keys.swu.templates.blockexpired,
      "recipient": {
        "name": firstName,
        "address": email
      },
      "template_data": template_data,
      "bcc": csm_bccs,
      "tags" : [ "og_blockexpired" ],
      "headers" : { "x-smtpapi" : '{\"asm_group_id\":' + sendgrid.group.limit_warning + '}' }
    };

    // Send Email and Track Delight in Librato
    return opengrowth.delight.sendwithus.email(sendWithUsPostBody);
};
