opengrowth.signals.uls = ( request, customer ) => {
    const categories = ['enable_uls'];
    const email = request.message.litmus || 'open-growth-activity@pubnub.com';//request.message.email
    const subject = 'You enabled ULS!';
    const sender_email = 'neumann@pubnub.com';
    const sender_name = 'Neumann';
    const reply_email = 'neumann@pubnub.com';
    const reply_name = 'Neumann';
    const bccs = [];
    
    let name = null;
    try { name = customer.person.name.givenName }
    catch(e) { name = null }

    const message = `<p>Hey ${name || 'there'},</p>` +
		`<p>I noticed that you enabled ULS in your ${request.message.app_name} app.</p>` +
		`<p>I don't know what ULS stands for, but you can probably find out <a href='http://lmgtfy.com/?q=pubnub+uls'>here</a></p>` + 
		`<p>Good luck,<br />Neumann</p>`; 

    opengrowth.delight.sendgrid.email(
        'features', message, email, name, sender_email, sender_name, reply_email, reply_name, subject, bccs, categories
    );
};
