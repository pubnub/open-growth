opengrowth.signals.reaction = ( signal, customer, name ) => {
    // customer param is automatically
    // augmented with clearbit and monkeylearn
    console.log(customer);
    return signal.ok();
};
