opengrowth.signals.test = ( request, customer, name ) => {
//opengrowth.on( 'test', ( request, customer ) => {
    // customer param is automatically
    // augmented with clearbit and monkeylearn
    //console.log( 'test', customer );
    opengrowth.delight.twitter.tweet(request, customer.email);
    return request.ok({test:true});
};
