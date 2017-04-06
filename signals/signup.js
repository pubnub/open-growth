opengrowth.signals.signup = ( request, customer ) => {
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

    let display_url = `https://admin.pubnub.com/#/user/${user.user_id}/` +
                      `account/${user.account_id}/` +
                      `app/${user.app_id}/key/${user.key_id}/`;
    let anchor_url  = display_url +
                      `?utm_source=EmailBlasts%20&utm_medium=` +
                      `Open-Growth&utm_campaign=` +
                      `EB-CY16-Q4-Open-Growth-01&utm_term=link2` +
                      `&utm_content=api-keys`;

    var template_data = {
        "customer_first_name" : firstName
      , "customer_last_name"  : lastName
      , "company_name"        : company_name
      , "csm_first_name"      : csm.first_name
      , "csm_last_name"       : csm.last_name
      , "csm_email"           : csm.email
      , "csm_phone"           : csm.phone
      , "csm_bccs"            : csm_bccs
      , "display_url"         : display_url //signup
      , "anchor_url"          : anchor_url  //signup
    };

    let lw = opengrowth.keys.sendgrid.group.limit_warning;
    let df = opengrowth.keys.sendgrid.group.default;
    let fe = opengrowth.keys.sendgrid.group.feature_enable;
    let ug = opengrowth.keys.sendgrid.group.usage_info;

    let header = `{\"asm_group_id\":${df},\"asm_groups_to_display\": [${lw},${df},${fe},${ug}],\"category\":[\"og_signup\"]}`;
    
    var sendWithUsPostBody = {
      "template": opengrowth.keys.swu.templates.signup,
      "recipient": {
        "name": firstName,
        "address": email
      },
      "template_data": template_data,
      "bcc": csm_bccs,
      "tags" : [ "og_signup" ],
      "headers" : {
        "x-smtpapi" : header
      }
    };

    // Send Email and Track Delight in Librato
    return opengrowth.delight.sendwithus.email(sendWithUsPostBody);
};
