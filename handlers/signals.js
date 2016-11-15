// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Open Growth Framework
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var opengrowth = {};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Libs
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const xhr    = require('xhr');
const kvdb   = require('kvstore');
const auth   = require('codec/auth');
const base64 = require('codec/base64');
const crypto = require('crypto');
const pubnub = require('pubnub');
const query  = require('codec/query_string');

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Open Growth Signals Handler
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
export default request => {
    const message = request.message;
    const signal  = message.signal;
    const email   = message.email;

    // Record the signal!
    opengrowth.track.signal( signal, message );//.then( (result) => {} );

    // TODO de-duplicate (prevent duplicate signals from activiating)
    // TODO track signal analytics with total/yr/mm/day/hour
    // TODO librato
    // TODO special track signal 'reaction' for extra metrics
    // TODO track sent delights
    // TODO send to SQL DB

    // TODO Augment/Extend 'SYNC' User Profile KV Entry
    //      with all new keys supplied in the signal data
    //      so we have a progressively built profile.

    // TODO Get Clearbit/MonkeyLearn
    // TODO from KV or build from scratch and save in KV.
    return opengrowth.customer(email).then( customer => {

        // Run any.js for '*'
        opengrowth.signals['*']( customer, signal );

        // TODO Untracked Signals!!!
        //      push to librato
        if (!opengrowth.signals[signal]) return request.ok();

        // Run the signal in /signals/ directory
        return opengrowth.signals[signal]( request, customer );

    } );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Ways to Connect with your Customers
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight = {};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Modules that Augment and Enhance with ML and AI
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.modules = {};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Signals
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.signals = {};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Customer Fetch
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.customer = (email) => {
    // TODO check kv store
    // TODO check kv store
    // TODO check kv store
    const usecase_classifier = 'cl_Lyv9HzfF';
    return new Promise( ( resolve, reject ) => {
        opengrowth.modules.clearbit.lookup(email).then( customer => {

            const description = (customer.company||{}).description;
            // TODO SAVE KV STORE
            // TODO SAVE KV STORE
            if (!description) return resolve(customer);

            opengrowth.modules.monkeylearn.classify(
                description,
                usecase_classifier
            ).then( usecase => {
                // TODO SAVE KV STORE
                // TODO SAVE KV STORE
                // TODO SAVE KV STORE
                customer.email   = email;
                customer.usecase = usecase;
                resolve(customer);
            } );
        } );
    } );
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Analytical Tracking of Delights
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.track = (key) => {
    // Counter Key
    const time = new Date();
    const y    = time.getFullYear();
    const m    = time.getMonth();
    const d    = time.getDate();
    const h    = time.getHours();
    const min  = time.getMinutes();

    // Increment KV Counters
    var counter = `opengrowth.${key}.${y}_${m}_${d}_${h}_${min}`;
    return kvdb.incrCounter( counter, 1 ).then( () => {
        return kvdb.getCounter(counter);
    } ).then( (value) => {
        // Record Resolutions
        kvdb.incrCounter( `opengrowth.${key}.${y}_${m}`,           1 );
        kvdb.incrCounter( `opengrowth.${key}.${y}_${m}_${d}`,      1 );
        kvdb.incrCounter( `opengrowth.${key}.${y}_${m}_${d}_${h}`, 1 );

        // Librato
        return opengrowth.modules.librato( `opengrowth.${key}`, value );
    } );
};


// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Track Signals Received
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.track.signal = ( signal, data ) => {
    return opengrowth.track(`signals.${signal}`);
    //.then( (result) => {
        //console.log( 'Libratted:', result );
    //} );
    // TODO
    // TODO log signal to MySQL
    // TODO 
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Track Delights Sent
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.track.delight = ( delight, signal, data ) => {
    return opengrowth.track(`delights.${delight}`);
    // TODO
    // TODO log delight to MySQL
    // TODO 
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Track Reactions
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.track.reaction = (what_goes_here) => {
    return opengrowth.track(`reactions`);
    // TODO
    // TODO log reaction to MySQL
    // TODO 
};


