opengrowth.signals.signup = ( request, customer ) => {
    const email   = 'open-growth-activity@pubnub.com';//request.message.email
    const subject = 'Your PubNub Account: Getting Started';
    const user    = request.message;
    const csm     = user.csm;

    let name = '';
    try       { name = customer.person.name.fullName }
    catch (e) { name = 'there' }

    const message =
        `<p>Hi ${name},</p>` +
        `<p>Welcome to PubNub. Your API Keys have been provisioned in 15 global Points of Presence.</p>` +
        `<p>By the way, my name is ${csm.first_name || 'Neumann'} and I can help you with your project when you have questions -  my mobile number is: ${csm.phone || '(415) 223-7552'}.</p>` + 
        `<p>Meanwhile, get started with:</p>` +
        `<p>PubNub Docs, APIs and SDKs</p>` +
        `<p><a href="https://www.pubnub.com/docs?utm_source=EmailBlasts%20&utm_medium=Open-Growth&utm_campaign=EB-CY16-Q4-Open-Growth-01&utm_term=link1&utm_content=docs-page">https://www.pubnub.com/docs</a></p>` +
        `<p>Your API Keys</p>` +
        `<p><a href="https://admin.pubnub.com/#/user/${user.user_id}/account/${user.account_id}/app/${user.app_id}/key/${user.key_id}/?utm_source=EmailBlasts%20&utm_medium=Open-Growth&utm_campaign=EB-CY16-Q4-Open-Growth-01&utm_term=link2&utm_content=api-keys">https://admin.pubnub.com/#/user/${user.user_id}/account/${user.account_id}/app/${user.app_id}/key/${user.key_id}/</a></p>` +
        `<p>Welcome Aboard! ${csm.first_name || 'Neumann'}</p>`;

    // Logging Message
    console.log(message);

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(
        'signup', message, email, name, subject
    );
};
