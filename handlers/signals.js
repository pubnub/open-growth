// Open Growth Signals Handler
export default request => {
    const message = request.message;
    const signal  = message.signal;
    const email   = message.email;

    // TODO Get Clearbit/MonkeyLearn
    // TODO from KV or build from scratch.
    opengrowth.customer(email).then( customer => {
        opengrowth.signals["*"]( signal, customer );
        opengrowth.signals[signal](customer);
    } );
}

// Open Growth Framework
const opengrowth = () => {};

// Signals
opengrowth.signals = {};
opengrowth.on      = ( signal, callback ) => {
    opengrowth.signals[signal] = callback;
}

// Customer Fetch
opengrowth.customer = (email) => {
    // check kv store
    // if not cached, build with Clearbit and MonkeyLearn
    // return promise
};

// Vendors
opengrowth.sendgrid.email = (email) => {
    // opengrowth.keys.sendgrid.apikey
};
