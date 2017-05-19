# Signal Handlers

**Signal** - An indication of a task that needs to be done automatically using Open Growth

Signal handlers are our controllers for each type of signal we send to Open Growth. Signal handlers are executed in the **delights.js** event handler, which is an [After Publish or Fire handler](https://www.pubnub.com/docs/blocks/event-handler-types#async-et-after-pub-fire). Signal handlers can trigger a customer **delight** or **module** depending on the end goal of the signal.

For customer delights, like sending an email, text, phone call, tweet, slice of cake, etc., we can prepare a request to an external API in the signal handler. After we prepare the data we want to send, we call the delight of our choosing. Here is an example of constructing a sign up email using a signal handler.

We prepare our POST body, and then call `opengrowth.delight.sendgrid.email` to send our request to the API.

```javascript
opengrowth.signals.signup = ( request, customer ) => {
    const message = request.message;
    let email     = customer.email || message.email;
    let bcc       = ""; // Set to your tracking email address

    let product  = opengrowth.modules.customer.getProduct(customer.usecase);
    let tutorial = opengrowth.modules.customer.getTutorial(customer.jobTitle);

    // Send email with SendGrid
    let sendgridPostBody = {
        "email"        : email
      , "name"         : customer.firstName
      , "subject"      : "Welcome!"
      , "sender_email" : "neumann@company.com"
      , "reply_email"  : "support@company.com"
      , "categories"   : [ "signup" ]
    };

    // Plain text email with SendGrid
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

```

Open Growth Signal handlers can also listen for signals like [webhooks](https://en.wikipedia.org/wiki/Webhook). If you use SendGrid to send emails, you may want to track the activity of those emails, like delivery, open rate, links clicked, marked as spam, etc. SendGrid offers an [Event Webhook](https://sendgrid.com/docs/API_Reference/Webhooks/event.html). If you enable this feature, SendGrid will periodically send a POST request to a URL of your choosing. The POST body will contain latest email activity.

Open Growth has a signal handler to process POSTs for SendGrid's Event Webhook in `open-growth/signals/sendgrid-updates.js`. Any emails that are marked with the category beginning with "og_" are dissected and logged in Open Growth's logs.

This example of a Webhook endpoint can be used as a guide to create your own handler for Open Growth.