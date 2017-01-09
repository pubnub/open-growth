opengrowth.signals.day7 = ( request, customer ) => {
    const email = request.message.email;
    const subject = `Following up re: PubNub`;
    const sender_email = request.message.csm.email;
    const sender_name = request.message.csm.full_name;
    const reply_email = request.message.csm.email;
    const reply_name = request.message.csm.full_name;
    const bccs  = request.message.csm.bccs;

    let name = '';
    try       { name = customer.person.name.givenName + ' - ' }
    catch (e) { name = '' }
    
    let company = '';
    try { 
    	if (customer.company.name != null) { 
    	    company = 'the ' + customer.company.name 
    	}
        else {
    	    throw "Company name is null";
    	}
    }
    catch (e) { company = "your company's"};

    const message =
        `<p>${name}I wanted to follow up on my email in case it got buried the other day.</p>` +
        `<p>Do you or someone from ${company} engineering team need help setting up realtime functionality with PubNub?</p>` + 
        `<p>PS: Check out our new "Introduction to PubNub BLOCKS" developer training video <a href="https://www.pubnub.com/developers/webinars/view-on-demand/?vidid=25177&utm_source=EmailBlasts%20&utm_medium=Open-Growth&utm_campaign=EB-CY16-Q4-Open-Growth-03&utm_term=link1&utm_content=intro-blocks-video">here</a>.</p>` +
        `<p>Best, ${request.message.csm.first_name}</p>`+
        `<p>This email would have been sent to: ${request.message.email}</p>`;

    opengrowth.delight.sendgrid.email(
        'day7', message, email, name, sender_email, sender_name, reply_email, reply_name, subject, bccs
    );
};
