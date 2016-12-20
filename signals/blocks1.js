opengrowth.signals.blocks1 = ( request, customer ) => {
    const email = 'open-growth-activity@pubnub.com';//request.message.email
    let subject = 'PubNub Block Expiring';

    let name = '';
    try       { name = customer.person.name.fullName }
    catch (e) { name = '' }

    var fname = '';
    try       { fname = customer.person.name.givenName }
    catch (e) { fname = 'there' }

    console.log(customer);
    console.log(request.message);

    const message =
        `<p>Hi ${fname},</p>` +
        `<p>We noticed your PubNub ${request.message.block_name} block in your ${request.message.app_} app will expire in 3 days. We have a 30 day limit on running block in the FREE tier. You can upgrade to a new plan to keep blocks running continuously.</p>` +
        `<p>To prevent your block from expiring, simply go <a href="https://admin.pubnub.com/#/user/${request.message.user_id}/account/${request.message.account_id}/app/${request.message.app_id}/key/${request.message.key_id}/block/${request.message.block_id}/event_handlers">here</a> and restart your block.</p>` +
        `<p>Need Help? <a href=mailto:support@pubnub.com?Subject=Block%20Expiring">Contact support</a> anytime.</p>` +
        `<p>Happy Coding,<br>Neumann - PubNub Blocks AI</p>`;

    opengrowth.delight.sendgrid.email(
        'blocks1', message, email, name, subject
    );
};
