opengrowth.signals.signup = ( request, customer ) => {
    const email = 'open-growth-activity@pubnub.com';//request.message.email
    const subject = 'Your PubNub Account: Getting Started';

    let name = '';
    try       { name = customer.person.name.fullName }
    catch (e) { name = 'there' }

    const message =
        `<p>Hi ${name},</p>` +
        `<p>Welcome to PubNub. My name is ${customer.csm.name}.</p>` + 
        `<p>Your API Keys have been provisioned in 15 global Points of Presence. I can help you with your project when you have questions -  my mobile number is: ${customer.csm.phone}.</p>` + 
        `<p>Meanwhile, get started with:</p>` +
        `<p>PubNub Docs, APIs and SDKs</p>` +
        `<p><a href="https://www.pubnub.com/docs">https://www.pubnub.com/docs</a></p>` +
        `<p>Your API Keys</p>` +
        `<p><a href="https://admin.pubnub.com/#/user/${customer.id}/account/${customer.accountid}/app/${customer.appid}/key/${customer.keyid}/">https://admin.pubnub.com/#/user/${customer.id}/account/${customer.accountid}/app/${customer.appid}/key/${customer.keyid}/</a></p>` +
        `<p>Welcome Aboard! ${customer.csm.name}</p>`;

    opengrowth.delight.sendgrid.email(
        'signup', message, email, name, subject
    );
};
