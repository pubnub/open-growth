// Reactions Handler
export default request => {
    const message = request.message;
    const signal  = message.signal;
    const email   = message.email;

    // TODO Get Clearbit/MonkeyLearn
    // TODO from KV or build from scratch.
    opengrowth.customer(email).then( customer => {
        console.log( email, customer, signal );
    } );
}

