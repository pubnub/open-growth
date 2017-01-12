opengrowth.signals.signup = ( request, customer ) => {
    const email   = request.message.email;
    const subject = 'Your PubNub Account: Getting Started';
    const user    = request.message;
    const csm     = user.csm;
    const bccs    = csm.bccs;
    const sender_name = 'Neumann';
    const sender_email = 'neumann@pubnub.com';
    const reply_email = 'support@pubnub.com';
    const reply_name = 'Support';

    let name = '';
    try       { name = customer.person.name.givenName }
    catch (e) { name = null }
    if ( name == 'Not Found' ) { name = null }

    const message =
        `<p>Hi ${name || 'there'},</p>` +
        `<p>` +
            `Welcome to PubNub. Your API Keys have been provisioned in 15 global Points of Presence.` +
            `<br />` + 
            `I am Neumann, an Artificial Intelligence alive in PubNub BLOCKS.` + 
            `Your designated human Craig and his awesome support team can be found at support@pubnub.com.  ` +
            `They respond really quickly and can answer just about any question in the universe.` + 
        `</p>` + 
        `<p>Get started with:</p>` +
        `<p>PubNub Docs, APIs and SDKs` +
        `<br />`+
        `<a href="https://www.pubnub.com/docs?utm_source=EmailBlasts%20&utm_medium=Open-Growth&utm_campaign=EB-CY16-Q4-Open-Growth-01&utm_term=link1&utm_content=docs-page">https://www.pubnub.com/docs</a></p>` +
        `<p>Your API Keys` +
        `<br />`+
        `<a href="https://admin.pubnub.com/#/user/${user.user_id}/account/${user.account_id}/app/${user.app_id}/key/${user.key_id}/?utm_source=EmailBlasts%20&utm_medium=Open-Growth&utm_campaign=EB-CY16-Q4-Open-Growth-01&utm_term=link2&utm_content=api-keys">https://admin.pubnub.com/#/user/${user.user_id}/account/${user.account_id}/app/${user.app_id}/key/${user.key_id}/</a></p>` +
        `<p>Welcome Aboard!</p>`;

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(
        'signup', message, email, name, sender_email, sender_name, reply_email, reply_name, subject, bccs
    );
};
