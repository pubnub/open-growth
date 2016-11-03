opengrowth.signals.test = ( request, customer, name ) => {
    // customer param is automatically
    // augmented with clearbit and monkeylearn
    //console.log( 'test', customer );
    
    // Twitter Test
    // opengrowth.delight.twitter.tweet(
    //    request
    //,   customer.email
    //);
    // return request.ok({test:true});

    // SendGrid Test
    opengrowth.delight.sendgrid.email(
        request
    ,   customer.email
    ,   request.message.subject
    );
    return request.ok({test:true});
};
