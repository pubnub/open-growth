// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Handles a Signup email, sends with SendWithUs Template
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.signals.signup = ( request, customer ) => {
    const message = request.message;
    let email  = customer.email || message.email;
    let bcc    = ""; // Set to your SalesForce tracking BCC

    let product = "Product";
    let tutorial = "Tutorial";

    // Send email with SendGrid
    let sendgridPostBody = {
        "email"        : email
      , "name"         : customer.firstName
      , "subject"      : "Welcome!"
      , "sender_email" : "neumann@pubnub.com"
      , "reply_email"  : "support@pubnub.com"
      , "categories"   : [ "og_c_signup" ]
      // Include these if you choose to use SendGrid's templates
      // , "template_id"   : opengrowth.keys.sendgrid.templates.signup
      // , "substitutions" : {
      //     "name"    : customer.firstName,
      //     "company" : customer.company
      // }
    };

    // Plain text email with SendGrid (remove this if you're using a template)
    sendgridPostBody.message = '' +
      `Hi ${customer.firstName || 'there'}!\n` +
      `Thanks for signing up for our service!\n` +
      `We see you are a ${customer.title } and you work at ${customer.company}.\n` +
      `Here is a link to our ${product} and here is a link to an ${tutorial}.\n` +
      `Welcome!\n` +
      `Neumann`;

    // Send Email!
    return opengrowth.delight.sendgrid.email(sendgridPostBody);
};
