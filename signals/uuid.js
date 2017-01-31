opengrowth.signals.uuid = ( request, customer ) => {
    let email = 'open-growth-activity@pubnub.com';
    // @if GOLD
    email = request.message.email;
    // @endif
    
    const bccs = [];
    const sender_email = 'neumann@pubnub.com';
    const sender_name = 'Neumann';
    const reply_email = 'support@pubnub.com';
    const reply_name = 'Support';
    const categories = ['uuid'];
    const subject = `Have you configured UUID's for your app?`;
    let name = '';

    const message = `<p>Hey there,</p>` +
                    `<p>I noticed that you have ${request.message.uuid_count} UUIDs generated across only ${request.message.ip_count} devices. If this isn't on purpose, RTFM: <a href='https://support.pubnub.com/support/solutions/articles/14000043671-how-do-i-set-the-uuid-'>How do I set the UUID?</a></p>` +
                    `<p>Love, Nuemann</p>`;

    opengrowth.delight.sendgrid.email(
        'day3', message, email, name, sender_email, sender_name, reply_email, reply_name, subject, bccs, categories
    );
};
