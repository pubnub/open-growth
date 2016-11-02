opengrowth.signals.test = ( request, customer, name ) => {
//opengrowth.on( 'test', ( request, customer ) => {
    // customer param is automatically
    // augmented with clearbit and monkeylearn
    //console.log( 'test', customer );
    
    //Twitter test
    // opengrowth.delight.twitter.tweet(request, customer.email);
    // return request.ok({test:true});

    //sendgrid test
    opengrowth.delight.sendgrid.email(request, customer.email, request.message.subject);
    return request.ok({test:true});
};
