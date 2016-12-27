opengrowth.signals.blocks2 = ( request, customer ) => {
    const email   = 'open-growth-activity@pubnub.com';//request.message.email
    const subject = 'PubNub Block Expiring Now';
    const sender_email = 'neumann@pubnub.com';
    const sender_name = 'Neumann';

    let name = '';
    try       { name = customer.person.name.givenName }
    catch (e) { name = null }
    if ( name == 'Not Found' ) { name = null }

    const url = `https://admin.pubnub.com/#/user/${request.message.user_id}/account/${request.message.account_id}/app/${request.message.app_id}/key/${request.message.app_id}/block/${request.message.block_id}/`;

    const message = 
        `<p>Hi ${name || 'there'},</p>` + 
        `<p>I noticed your PubNub ${request.message.block_name} block in your ${request.message.app_name} app will expire within 24 hours. We have a 30 day limit on running blocks in the FREE tier. You can upgrade to a new plan starting out at $49 to keep blocks running continuously.</p>` +
        `<p>It will be really sad if your workflow got disrupted.</p>` +
        `<p>It’s really easy to fix. Simply click here <a href='${url}'>here</a> and restart your block.</p>` +
        `<p>Need help? <a href='mailto:support@pubnub.com'>Contact support</a> anytime.</p>` +
        `<p>Happy coding,<br>` +
        `Neumann</p>`;

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(
        'blocks2', message, email, name, sender_email, sender_name, subject
    );
};
