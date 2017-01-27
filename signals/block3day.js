opengrowth.signals.block3day = ( request, customer ) => {
    let email = 'open-growth-activity@pubnub.com';
    // @if GOLD
    email = request.message.email;
    // @endif

    const subject = 'PubNub Block Expiring';
    const sender_email = 'neumann@pubnub.com';
    const sender_name = 'Neumann';
    const reply_email = 'support@pubnub.com';
    const reply_name = 'Support';
    const categories = ['block3day'];
    const bccs = [];

    let name = '';
    try       { name = customer.person.name.givenName }
    catch (e) { name = null }
    if ( name == 'Not Found' ) { name = null }

    let message = 
        `<p>Hi ${name || 'there'},</p>` + 
        `<p>I noticed you have one or more blocks that will expire in 3 days. We have a 30 day limit on running blocks in the FREE tier. You can upgrade your usage plan to keep blocks running continuously.</p>` +
        `<p>It will be really sad if your workflow gets disrupted.</p>` +
        `<p>It’s really easy to fix, just follow the links and restart your blocks:</p>`;

    message += '<ul>';
    for (let block of request.message.blocks){
        message += `<li><a href='https://admin.pubnub.com/#/user/${block.user_id}/account/${block.account_id}/app/${block.app_id}/key/${block.app_key_id}/block/${block.block_id}/event_handlers?link=block</li>'>${block.block_name}</a>`;
    }
    message += '</ul>';

    message += `<p>Need help? <a href='mailto:support@pubnub.com'>Contact support</a> anytime.</p>` +
        `<p>Happy coding,<br>` +
        `Neumann</p>`;

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(
        'block3day', message, email, name, sender_email, sender_name, reply_email, reply_name, subject, bccs, categories
    );
};
