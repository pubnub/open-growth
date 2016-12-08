opengrowth.signals.day7 = ( request, customer ) => {
    const name = '';

    const message = 'this gets sent to everyone that signed up 7 days ago';

    // Debug show Message
    console.log(message);

    // Send Email
    //const email   = request.message.email;
    //const email   = 'blum.stephen@gmail.com';
    const email   = 'open-growth-activity@pubnub.com';
    const subject = 'day7';
    opengrowth.delight.sendgrid.email(
        'day7', message, email, name, subject
    );
};
