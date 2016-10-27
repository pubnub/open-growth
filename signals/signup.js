opengrowth.signals.signup = ( signal, customer, name ) => {
    // customer param is automatically
    // augmented with clearbit and monkeylearn
    console.log(customer);
    return signal.ok();
};
