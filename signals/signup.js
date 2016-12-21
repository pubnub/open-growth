opengrowth.signals.signup = ( request, customer ) => {
    const email   = 'open-growth-activity@pubnub.com';//request.message.email
    const subject = 'Your PubNub Account: Getting Started';
    const user    = request.message;
    const csm     = user.csm;
    const bccs    = user.csm.bccs || [];

    let name = '';
    try       { name = customer.person.name.fullName }
    catch (e) { 
    	try       { name = user.first_name }
	catch (e) { name = 'there' }
    }

    const message =
        `<p>Hi ${name},</p>` +
        `<p>Welcome to PubNub. Your API Keys have been provisioned in 15 global Points of Presence.</p>` +
        `<p>By the way, I am Neumann, an Artificial Intelligence alive in PubNub BLOCKS. Welcome to the Programmable Network. Your designated human is ${csm.full_name} and he can help you with your project when you have questions -  his phone is ${csm.phone || '(415) 223-7552'} and email is ${csm.email}.</p>` + 
        `<p>Meanwhile, get started with:</p>` +
        `<p>PubNub Docs, APIs and SDKs` +
        `<br />`+
        `<a href="https://www.pubnub.com/docs?utm_source=EmailBlasts%20&utm_medium=Open-Growth&utm_campaign=EB-CY16-Q4-Open-Growth-01&utm_term=link1&utm_content=docs-page">https://www.pubnub.com/docs</a></p>` +
        `<p>Your API Keys` +
        `<br />`+
        `<a href="https://admin.pubnub.com/#/user/${user.user_id}/account/${user.account_id}/app/${user.app_id}/key/${user.key_id}/?utm_source=EmailBlasts%20&utm_medium=Open-Growth&utm_campaign=EB-CY16-Q4-Open-Growth-01&utm_term=link2&utm_content=api-keys">https://admin.pubnub.com/#/user/${user.user_id}/account/${user.account_id}/app/${user.app_id}/key/${user.key_id}/</a></p>` +
        `<p>Welcome Aboard!</p>`+
        `<p>This email would have been sent to: ${request.message.email}</p>`;

    // Logging Message
    console.log(request.message);

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(
        'signup', message, email, name, subject, bccs
    );
};
