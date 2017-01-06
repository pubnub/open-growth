opengrowth.signals.test = ( request, customer ) => {
    console.log('******TESTING******');
    console.log(request.message);
    console.log(customer);

    const message = JSON.stringify(request.message);
    const email = 'open-growth-activity@pubnub.com';
    const name = "Neumann";
    const sender_email = "neumann@pubnub.com";
    const sender_name = "Neumann";
    const reply_email = "neumann@pubnub.com";
    const reply_name = "Neumann";
    const subject = "this is a test";
    const bccs = "dustin@pubnub.com";

    opengrowth.delight.sendgrid.email(
        'signup', message, email, name, sender_email, sender_name, reply_email, reply_name, subject, bccs
    );
};
