opengrowth.signals.day3 = ( request, customer ) => {
    const email = 'open-growth-activity@pubnub.com';//request.message.email
    const subject = `${customer.company.name} - adding realtime to your app`;

    let name = '';
    try       { name = customer.person.name.fullName }
    catch (e) { name = 'there' }

    var fname = '';
    try       { fname = ', '+customer.person.name.givenName + '.' }
    catch (e) { fname = '.' }

    const message =
        `<p>Hope you’ve had the time to navigate through the PubNub Admin Portal and the PubNub Docs Page over the last few days${fname}</p>` + //this might get weird
        `<p>On another note, I see that you work at ${request.company.name}. Curious if you or another member of ${request.company.name} is assessing PubNub to power realtime capabilities in your application?</p>` + 
        `<p>Looking forward to hearing from you soon. In the meantime, here's a developer's guide to PubNub:</p>` + 
        `<p><a href="https://www.pubnub.com/developers/tech/how-pubnub-works/?utm_source=EmailBlasts%20&utm_medium=Open-Growth&utm_campaign=EB-CY16-Q4-Open-Growth-02&utm_term=link1&utm_content=how-pubnub-works">How PubNub Works</a></p>` +
        `<p>Best, ${request.csm.name}</p>`;

    opengrowth.delight.sendgrid.email(
        'day3', message, email, name, subject
    );
};
