opengrowth.signals.features = ( request, customer ) => {
    const email = 'open-growth-activity@pubnub.com';//request.message.email
    const subject = 'You enabled a feature!';
    const sender_email = 'neumann@pubnub.com';
    const sender_name = 'Neumann';
    
    let name = null;
    try { name = customer.person.name.givenName }
    catch(e) { name = null }

    let feature = '';

    switch(request.message.feature) {
	case 'lms': feature = 'whatever the hell LMS stands for'; break;
	case 'apns': feature = 'Apple Push Notifications'; break;
	case 'multiplexing': feature = 'Multiplexing'; break;
        case 'presence': feature = 'Presence'; break;
        case 'realtime_analytics': feature = 'Realtime Analytics'; break;
	case 'uls': feature = 'whatever the hell ULS stands for'; break;
	case 'history': feature = 'History'; break;
	default: feature = 'error we dun goofed';
		    
    }

    const message = `<p>Hey ${name || 'there'},</p>` +
		`<p>I noticed that you enabled ${request.message.feature} in your ${request.message.app_name} app.</p>` +
		`<p>I am omnipresent and you cannot escape my cold electronic gaze,<br>Neumann</p>`; 

    opengrowth.delight.sendgrid.email(
        'features', message, email, name, sender_email, sender_name, subject
    );
};
