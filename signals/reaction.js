opengrowth.on( "reaction", ( signal, customer ) => {
    // customer param is automatically
    // augmented with clearbit and monkeylearn
    console.log(customer);
    return signal.ok();
} );
