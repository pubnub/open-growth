// On any signal
opengrowth.on( "*", ( signal, customer ) => {
    // customer param is automatically
    // augmented with clearbit and monkeylearn
    console.log( signal, customer );
} );

