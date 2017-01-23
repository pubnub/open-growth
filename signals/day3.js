opengrowth.signals.day3 = ( request, customer ) => {
    const categories = ['day3'];
    const email = request.message.litmus || request.message.email;
    const bccs = request.message.csm.bccs;
    const sender_email = request.message.csm.email;
    const sender_name = request.message.csm.full_name;
    const reply_email = request.message.csm.email;
    const reply_name = request.message.csm.full_name;
    
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
    try       {
        if ( customer.person.name.fullName == 'Not Found' || customer.person.name.fullName == null || customer.person.name.fullName == 'null' ){
            name = '';
        } else {
            name = customer.person.name.fullName;
        }
    }
    catch (e) { name = '' }

    let fname = '';
    try       { 
        if ( customer.person.name.givenName == 'Not Found' || customer.person.name.givenName == null || customer.person.name.givenName == 'null' ){
            fname = '.';
        } else {
            fname = ', '+customer.person.name.givenName + '.';
        }
    }
    catch (e) { fname = '.' }
    
    let company = '';
    try { company = customer.company.name }
    catch (e) { company = '' }

    let message = `<p>Hope you’ve had the time to navigate through the PubNub Admin Portal and the PubNub Docs Page over the last few days${fname}</p>`; 
    if (company == '' || company == null) { 
        message += `Curious if you or another member of your company is assessing PubNub to power realtime capabilities in your application?</p>`;
    } else {
	message += `<p>On another note, I see that you work at ${company}. Curious if you or another member of ${company} is assessing PubNub to power realtime capabilities in your application?</p>`;
    }
    
    message += `<p>Looking forward to hearing from you soon. In the meantime, here's a developer's guide to PubNub:</p>` + 
               `<p><a href="https://www.pubnub.com/developers/tech/how-pubnub-works/?utm_source=EmailBlasts%20&utm_medium=Open-Growth&utm_campaign=EB-CY16-Q4-Open-Growth-02&utm_term=link1&utm_content=how-pubnub-works&link=devguide">How PubNub Works</a></p>` +
               `<p>Best, ${request.message.csm.first_name}</p>`;

    opengrowth.delight.sendgrid.email(
        'day3', message, email, name, sender_email, sender_name, reply_email, reply_name, subject, bccs, categories
    );
};
