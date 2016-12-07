opengrowth.signals.example = ( request, customer ) => {
    // Try to get a Name
    var name = '';
    try       { name = customer.person.name.fullName }
    catch (e) { name = '' }

    // Send Email
    const recipient = 'open-growth-activity@pubnub.com';
    const subject   = `Hi ${name || 'there'}!`;
    opengrowth.delight.sendgrid.email(
        'example', message, recipient, name, subject
    );
};
