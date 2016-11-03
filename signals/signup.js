opengrowth.signals.signup = ( request, customer ) => {
    // customer param is automatically
    // augmented with clearbit and monkeylearn
    //console.log(customer);
    return request.ok();
};
