opengrowth.signals.block1day = ( request, customer ) => {
    const categories = ['block1day'];
    const email   = 'open-growth-activity@pubnub.com';//request.message.email
    const subject = 'PubNub Block Expiring Now';
    const sender_email = 'neumann@pubnub.com';
    const sender_name = 'Neumann';
    const reply_email = 'support@pubnub.com';
    const reply_name = 'Support';
    const bccs = [];

    let name = '';
    try       { name = customer.person.name.givenName }
    catch (e) { name = null }
    if ( name == 'Not Found' ) { name = null }

    const url = `https://admin.pubnub.com/#/user/${request.message.user_id}/account/${request.message.account_id}/app/${request.message.app_id}/key/${request.message.app_key_id}/block/${request.message.block_id}/event_handlers?link=block`;

    const message = 
        `<p>Hi ${name || 'there'},</p>` + 
        `<p>I noticed your PubNub ${request.message.block_name} block in your ${request.message.app_name} app will expire within 24 hours. We have a 30 day limit on running blocks in the FREE tier. You can upgrade your usage plan to keep blocks running continuously.</p>` +
        `<p>It will be really sad if your workflow gets disrupted.</p>` +
        `<p>It’s really easy to fix. Simply click <a href='${url}'>here</a> and restart your block.</p>` +
        `<p>Need help? <a href='mailto:support@pubnub.com'>Contact support</a> anytime.</p>` +
        `<p>Happy coding,<br>` +
        `Neumann</p>`;

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(
        'block1day', message, email, name, sender_email, sender_name, reply_email, reply_name, subject, bccs, categories
    );
};
