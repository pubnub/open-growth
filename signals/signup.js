opengrowth.signals.signup = ( request, customer ) => {
    const email   = 'open-growth-activity@pubnub.com';//request.message.email
    const subject = 'Your PubNub Account: Getting Started';
    const user    = request.message;
    const csm     = user.csm;

    //{ "csm": { "phone": "", "first_name": "Jason", "last_name": "Wimp", "email": "jason@pubnub.com", "full_name": "Jason Wimp" }, "user_id": 303915, "account_id": 303915, "signal": "signup", "app_id": 343113, "id": 303915, "key_id": 238389,  "email": "it@myhappyforce.com" }

    let name = '';
    try       { name = customer.person.name.fullName }
    catch (e) { name = 'there' }

    // Create Message template
    const message = `
        <p>Hi ${name},</p>
        <p>Welcome to PubNub. My name is ${csm.first_name || 'Neumann'}.</p>  
        <p>Your API Keys have been provisioned in 15 global Points of Presence.  
        I can help you with your project when you have questions - my mobile number is: ${csm.phone || '(415) 223-7552'}.</p>  
        <p>Meanwhile, get started with:</p> 
        <p>PubNub Docs, APIs and SDKs</p> 
        <p><a href="https://www.pubnub.com/docs">https://www.pubnub.com/docs</a></p> 
        <p>Your API Keys</p> 
        <p><a href="https://admin.pubnub.com/#/user/${user.user_id}/account/${user.account_id}/app/${user.app_id}/key/${user.key_id}/">
            https://admin.pubnub.com/#/user/${user.user_id}/account/${user.account_id}/app/${user.app_id}/key/${user.key_id}/
        </a></p> 
        <p>Welcome Aboard! ${csm.first_name || 'Neumann'}</p>
    `;

    // Logging Message
    console.log(message);

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(
        'signup', message, email, name, subject
    );
};
