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
