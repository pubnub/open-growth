opengrowth.signals.uuid = ( request, customer ) => {
    const user  = request.message;
    const email = 'open-growth-activity@pubnub.com';
    // @if GOLD
    email = request.message.email;
    // @endif

    let sendgridPostBody = {
        "signal"       : "uuid"
      , "message"      : message
      , "email"        : email
      , "name"         : ""
      , "sender_email" : "neumann@pubnub.com"
      , "sender_name"  : "Neumann"
      , "reply_email"  : "support@pubnub.com"
      , "reply_name"   : "Support"
      , "subject"      : "Have you configured UUID's for your app?"
      , "bccs"         : []]
      , "categories"   : [ "uuid" ]
    }

    sendgridPostBody.message = `<p>Hey there,</p>` +
        `<p>I noticed that you have ${user.uuid_count} UUIDs generated across only ${user.ip_count} devices. If this isn't on purpose, RTFM: <a href='https://support.pubnub.com/support/solutions/articles/14000043671-how-do-i-set-the-uuid-'>How do I set the UUID?</a></p>` +
        `<p>Love, Nuemann</p>`;

    opengrowth.delight.sendgrid.email(sendgridPostBody);
};
