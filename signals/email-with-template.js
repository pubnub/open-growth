// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Handles an email, sends with SendWithUs Template
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.signals.emailWithTemplate = ( request, customer ) => {
    const message = request.message;
    let email  = customer.email || message.email;
    let bcc    = null; // Set to your SalesForce tracking BCC

    // Send as a template to SendWithUs with SendGrid
    let template_data = {
        "customer_first_name" : customer.firstName
      , "customer_last_name"  : customer.lastName
      , "company_name"        : customer.company
    };

    let template = message.signal;

    let sendWithUsPostBody = {
      "template": opengrowth.keys.swu.templates[template],
      "recipient": {
        "name": customer.firstName,
        "address": email
      },
      "template_data": template_data,
      "bcc": bcc,
      "tags" : [ "og_c_signup" ],
      "sender" : {
        "name": "Neumann",
        "address": "neumann@mycompany.com",
        "reply_to": "support@mycompany.com"
      }
    };

    // Send Email!
    return opengrowth.delight.sendwithus.email(sendWithUsPostBody);
};
