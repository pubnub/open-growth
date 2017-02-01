opengrowth.signals.day3 = ( request, customer ) => {
    const user = request.message;
    const csm  = user.csm;
    let email  = 'open-growth-activity@pubnub.com';
    // @if GOLD
    email = user.email;
    // @endif

    let sendgridPostBody = {
        "signal"       : "day3"
      , "message"      : ""
      , "email"        : email
      , "name"         : ""
      , "sender_email" : csm.email
      , "sender_name"  : csm.full_name
      , "reply_email"  : csm.email
      , "reply_name"   : csm.full_name
      , "subject"      : ""
      , "bccs"         : csm.bccs || []
      , "categories"   : [ "day3" ]
    }

    try { 
        if(customer.company.name == null || customer.company.name == 'null' ){
            sendgridPostBody.subject = `Adding realtime to your app`;
        } else {
            sendgridPostBody.subject = `${customer.company.name} - adding realtime to your app`
        }
    }
    catch(e) { sendgridPostBody.subject = `Adding realtime to your app`}

    try {
        if ( customer.person.name.fullName == 'Not Found' || customer.person.name.fullName == null || customer.person.name.fullName == 'null' ){
            sendgridPostBody.name = '';
        } else {
            sendgridPostBody.name = customer.person.name.fullName;
        }
    }
    catch (e) { sendgridPostBody.name = '' }

    let fname = '';
    try       { 
        if ( customer.person.name.givenName == 'Not Found' || customer.person.name.givenName == null || customer.person.name.givenName == 'null' ){
            fname = '.';
        } else {
            fname = ', ' + customer.person.name.givenName + '.';
        }
    }
    catch (e) { fname = '.' }
    
    let company = '';
    try { company = customer.company.name }
    catch (e) { company = '' }

    sendgridPostBody.message = `<p>Hope you’ve had the time to navigate through the PubNub Admin Portal and the PubNub Docs Page over the last few days${fname}</p>`; 
    if (company == '' || company == null) { 
        sendgridPostBody.message += `Curious if you or another member of your company is assessing PubNub to power realtime capabilities in your application?</p>`;
    } else {
	sendgridPostBody.message += `<p>On another note, I see that you work at ${company}. Curious if you or another member of ${company} is assessing PubNub to power realtime capabilities in your application?</p>`;
    }
    
    sendgridPostBody.message += `<p>Looking forward to hearing from you soon. In the meantime, here's a developer's guide to PubNub:</p>` + 
               `<p><a href="https://www.pubnub.com/developers/tech/how-pubnub-works/?utm_source=EmailBlasts%20&utm_medium=Open-Growth&utm_campaign=EB-CY16-Q4-Open-Growth-02&utm_term=link1&utm_content=how-pubnub-works&link=devguide">How PubNub Works</a></p>` +
               `<p>Best, ${csm.first_name}</p>`;

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(sendgridPostBody);
};
