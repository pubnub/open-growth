opengrowth.signals.test = ( request, customer, name ) => {
//opengrowth.on( 'test', ( request, customer ) => {
    // customer param is automatically
    // augmented with clearbit and monkeylearn
    //console.log( 'test', customer );
    
    //Twitter test
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // opengrowth.delight.twitter.tweet(request, customer.email);
    // return request.ok({test:true});
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // blocks test payload
    // {
    //     "signal": "test",
    //     "tweet": "Tweet via Open Growth #pubnub"
    // }

    //sendgrid test
    // // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // opengrowth.delight.sendgrid.email(request, customer.email, request.message.subject);
    // return request.ok({test:true});
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // blocks test payload
    // {
    //     "signal": "test",
    //     "to": "email@address.com",
    //     "toname": "John Doe",
    //     "subject": "Open Growth Test",
    //     "text": "An email via Open Growth!"
    // }

    //ringcentral test
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // opengrowth.delight.ringcentral.sms(request, customer.email, customer.given_name, customer.location);
    // return request.ok({test:true});
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // blocks test payload
    // {
    //     "signal": "test",
    //     "text": "Text via Open Growth! www.pubnub.com",
    //     "recipientPhone": "a_phone_number"
    // }

    //facebook test
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    opengrowth.delight.facebook.post(request, customer.email);
    return request.ok({test:true});
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // blocks test payload
    // {
    //     "signal": "test",
    //     "content": "Page status update via Open Growth #pubnub"
    // }
};