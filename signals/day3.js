opengrowth.signals.day3 = ( request, customer ) => {
    const email = 'open-growth-activity@pubnub.com';//request.message.email
    let subject = '';
    try { 
        if(customer.company.name == null || customer.company.name == 'null' ){
            subject = `Adding realtime to your app`;
        } else {
            subject = `${customer.company.name} - adding realtime to your app`
        }
    }
    catch(e) { subject = `Adding realtime to your app`}

    let name = '';
    try       { name = customer.person.name.fullName }
    catch (e) { name = '' }

    var fname = '';
    try       { fname = ', '+customer.person.name.givenName + '.' }
    catch (e) { fname = '.' }
    
    var company = '';
    try { company = customer.company.name }
    catch (e) { company = '' }

    const message = `<p>Hope you’ve had the time to navigate through the PubNub Admin Portal and the PubNub Docs Page over the last few days${fname}</p>`; 
    if (company == '') { 
        message += `Curious if you or another member of your company is assessing PubNub to power realtime capabilities in your application?</p>`;
    } else {
	message += `<p>On another note, I see that you work at ${company}. Curious if you or another member of ${company} is assessing PubNub to power realtime capabilities in your application?</p>`;
    }
    
    message += `<p>Looking forward to hearing from you soon. In the meantime, here's a developer's guide to PubNub:</p>` + 
               `<p><a href="https://www.pubnub.com/developers/tech/how-pubnub-works/?utm_source=EmailBlasts%20&utm_medium=Open-Growth&utm_campaign=EB-CY16-Q4-Open-Growth-02&utm_term=link1&utm_content=how-pubnub-works">How PubNub Works</a></p>` +
               `<p>Best, ${request.message.csm.first_name}</p>`+
               `<p>This email would have been sent to: ${request.message.email}</p>`;

    opengrowth.delight.sendgrid.email(
        'day3', message, email, name, subject
    );
};
