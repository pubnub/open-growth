opengrowth.signals.day7 = ( request, customer ) => {
    const user = request.message;
    const csm  = user.csm;
    let email = 'open-growth-activity@pubnub.com';
    // @if GOLD
    email = user.email;
    // @endif

    let sendgridPostBody = {
        "signal"       : "day7"
      , "message"      : ""
      , "email"        : email
      , "name"         : ""
      , "sender_email" : csm.email
      , "sender_name"  : csm.full_name
      , "reply_email"  : csm.email
      , "reply_name"   : csm.full_name
      , "subject"      : "Following up re: PubNub"
      , "bccs"         : csm.bccs || []
      , "categories"   : [ "day7" ]
    }

    sendgridPostBody.name = '';
    try       { sendgridPostBody.name = customer.person.name.givenName + ' - ' }
    catch (e) { sendgridPostBody.name = '' }
    
    let company = '';
    try { 
        if (customer.company.name != null) { 
            company = 'the ' + customer.company.name 
        }
        else {
            throw "Company name is null";
        }
    }
    catch (e) { company = "company's"};

    sendgridPostBody.message =
        `<p>${sendgridPostBody.name}I wanted to follow up on my email in case it got buried the other day.</p>` +
        `<p>Can I help you or someone from your ${company} engineering team learn more about PubNub's APIs?</p>` + 
        `<p>PS: Check out our new "Introduction to PubNub BLOCKS" developer training video <a href="https://www.pubnub.com/developers/webinars/view-on-demand/?vidid=25177&utm_source=EmailBlasts%20&utm_medium=Open-Growth&utm_campaign=EB-CY16-Q4-Open-Growth-03&utm_term=link1&utm_content=intro-blocks-video&link=blocksvid">here</a>.</p>` +
        `<p>Best, ${csm.first_name}</p>`;

    // Send Email and Track Delight in Librato
    opengrowth.delight.sendgrid.email(sendgridPostBody);
};
