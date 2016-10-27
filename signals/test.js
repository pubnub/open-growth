opengrowth.signals.test = ( signal, customer, name ) => {
//opengrowth.on( "test", ( signal, customer ) => {
    // customer param is automatically
    // augmented with clearbit and monkeylearn
    console.log( "test", customer );
    return signal.ok({test:true});
};
