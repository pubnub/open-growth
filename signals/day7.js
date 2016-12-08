opengrowth.signals.day7 = ( request, customer ) => {
    const email = 'open-growth-activity@pubnub.com';//request.message.email
    const subject = `Following up re: PubNub`;

    let name = '';
    try       { name = customer.person.name.fullName }
    catch (e) { name = 'there' }

    const message =
        `<p>${name} - I wanted to follow up on my email in case it got buried the other day.</p>` + //this might get weird
        `<p>Do you or someone from the ${customer.company.name} engineering team need help setting up realtime functionality with PubNub?</p>` + 
        `<p>PS: Check out our new "Introduction to PubNub BLOCKS" developer training video <a href="https://www.pubnub.com/developers/tech/how-pubnub-works/">here</a>.</p>` +
        `<p>Best, ${customer.csm.name}</p>`;

    opengrowth.delight.sendgrid.email(
        'day7', message, email, name, subject
    );
};
