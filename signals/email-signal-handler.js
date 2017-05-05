// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Handles all delight signals that are sent as emails
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.signals.email_signal_handler = ( request, customer ) => {
    const user = request.message;
    const csm  = user.csm || {};
    const csm_bccs = csm.bccs ? csm.bccs : [];
    let email  = user.litmus || opengrowth.keys.pubnub.test_bcc;
    // @if GOLD
    email = user.email;
    // @endif

    // UUID Warning
    let uuid_count = user.uuid_count || '0';
    let ip_count   = user.ip_count   || '0';

    // Blocks Expiration
    let blocks_name_array = [];
    let blocks_url_array = [];

    if ( user.blocks ) {
      for ( let block of request.message.blocks ) {
          blocks_name_array.push(`${block.block_name}`);
          blocks_url_array.push('https://admin.pubnub.com/#/user/' +
            `${block.user_id}/account/${block.account_id}/app/${block.app_id}` +
            `/key/${block.app_key_id}/block/${block.block_id}/event_handlers`);
      }
    }
    
    let display_url  = 'https://admin.pubnub.com/#/' + 
      `user/${user.user_id}/account/${user.account_id}` +
      `/app/${user.app_id}/key/${user.key_id}/`;

    if ( !user.user_id || !user.account_id || !user.app_id || !user.key_id ) {
      display_url = null;
    }

    let template_data = {
        "customer_first_name" : customer.firstName
      , "customer_last_name"  : customer.lastName
      , "company_name"        : customer.company
      , "csm_first_name"      : csm.first_name
      , "csm_last_name"       : csm.last_name
      , "csm_email"           : csm.email
      , "csm_phone"           : csm.phone
      , "app_name"            : user.app_name
      , "blocks_name_array"   : blocks_name_array //Blocks Expiration Only
      , "blocks_url_array"    : blocks_url_array  //Blocks Expiration Only
      , "app_name"            : user.app_name
      , "display_url"         : display_url
      , "anchor_url"          : display_url
    };

    // TODO: Remove when New Unsubscribe is complete or SendWithUs is replaced
    let lw = opengrowth.keys.sendgrid.group.limit_warning;
    let df = opengrowth.keys.sendgrid.group.default;
    let fe = opengrowth.keys.sendgrid.group.feature_enable;
    let ug = opengrowth.keys.sendgrid.group.usage_info;

    // TODO: Remove when New Unsubscribe is complete or SendWithUs is replaced
    let unsubscribe_groups = {
        "signup"                    : "default"
      , "day3"                      : "default"
      , "day7"                      : "default"
      , "upgrade_free"              : null
      , "uuid"                      : "feature_enable"
      , "usage"                     : "usage_info"
      , "block1day"                 : "limit_warning"
      , "block3day"                 : "limit_warning"
      , "blockexpired"              : "limit_warning"
      , "enable_realtime_analytics" : "feature_enable"
      , "enable_history"            : "feature_enable"
      , "enable_apns"               : "feature_enable"
      , "enable_multiplexing"       : "feature_enable"
      , "enable_uls"                : "feature_enable"
      , "enable_presence"           : "feature_enable"
    };

    // TODO: Remove when New Unsubscribe is complete or SendWithUs is replaced
    let current = opengrowth.keys.sendgrid.group[unsubscribe_groups[user.signal]];

    let template = user.signal;
    let tag      = "og_" + template;

    // TODO: Remove when New Unsubscribe is complete or SendWithUs is replaced
    let xsmtpapi = `{\"asm_group_id\":${current},\"asm_groups_to_display\": [${lw},${df},${fe},${ug}],\"category\":[\"${tag}\"]}`;

    let sendWithUsPostBody = {
      "template": opengrowth.keys.swu.templates[template],
      "recipient": {
        "name": customer.firstName,
        "address": email
      },
      "template_data": template_data,
      "bcc": csm_bccs,
      "tags" : [ tag ],
      "headers" : {
        "x-smtpapi" : xsmtpapi
      }
    };

    // Upgrade Free
    if ( user.signal === 'upgrade_free' ) {
      // TODO: remove the delete statement after New Unsubscribe is complete or SendWithUs is replaced
      // Remove unsubscribe link if the email is from the CSM
      delete sendWithUsPostBody.headers;
      sendWithUsPostBody.sender = {
        "name": csm.first_name + " " + csm.last_name,
        "address": csm.email,
        "reply_to": csm.email
      }
    }

    // Send Email and Track Delight in Librato
    return opengrowth.delight.sendwithus.email(sendWithUsPostBody);
};

opengrowth.signals.signup              = opengrowth.signals.email_signal_handler;
opengrowth.signals.day3                = opengrowth.signals.email_signal_handler;
opengrowth.signals.day7                = opengrowth.signals.email_signal_handler;
opengrowth.signals.block1day           = opengrowth.signals.email_signal_handler;
opengrowth.signals.block3day           = opengrowth.signals.email_signal_handler;
opengrowth.signals.blockexpired        = opengrowth.signals.email_signal_handler;
opengrowth.signals.enable_multiplexing = opengrowth.signals.email_signal_handler;
opengrowth.signals.enable_presence     = opengrowth.signals.email_signal_handler;
opengrowth.signals.enable_uls          = opengrowth.signals.email_signal_handler;
opengrowth.signals.enable_apns         = opengrowth.signals.email_signal_handler;
opengrowth.signals.enable_history      = opengrowth.signals.email_signal_handler;
opengrowth.signals.enable_realtime_analytics = opengrowth.signals.email_signal_handler;
// opengrowth.signals.enable_lms = opengrowth.signals.email_signal_handler;
opengrowth.signals.upgrade_free        = opengrowth.signals.email_signal_handler;
opengrowth.signals.usage               = opengrowth.signals.email_signal_handler;
opengrowth.signals.uuid                = opengrowth.signals.email_signal_handler;