// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Open Growth Framework
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var opengrowth = {};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Libs
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const http = require('xhr');
const kvdb = require("kvstore");
const auth = require('codec/auth');

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Open Growth Signals Handler
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
export default request => {
    const message = request.message;
    const signal  = message.signal;
    const email   = message.email;

    // Save a Stat!
    opengrowth.track(`signals.${signal}`).then( (result) => {
        //console.log( 'Libratted:', result );
    } );

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
    // TODO from KV or build from scratch.
    return opengrowth.customer(email).then( customer => {
        opengrowth.signals['*']( customer, signal );
        return opengrowth.signals[signal]( request, customer );
    } );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Signals
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.signals = {};
// Alert! This failes on BLOCKS - BUG being patched.
// Directly access the signals dictionary for now.
/*
opengrowth.on      = ( signal, callback ) => {
    opengrowth.signals[signal] = callback;
};*/

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Customer Fetch
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.customer = (email) => {
    // TODO
    // check kv store
    // if not cached, build with Clearbit and MonkeyLearn
    // return promise
    return new Promise( ( resolve, reject ) => {
        resolve({ clearbit: email });
    } );
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Analytical Tracking of Delights
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.track = (key) => {
    // increment KV for `opengrowth.${key}`.
    // increment KV for `opengrowth.${key}.yyyy_mm`.
    // increment KV for `opengrowth.${key}.yyyy_mm_dd`.
    // increment KV for `opengrowth.${key}.yyyy_mm_dd_hh`.
    // increment KV for `opengrowth.${key}.yyyy_mm_dd_hh_mm`.

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
        //console.log('did the thing:', counter, value);

        // Record Resolutions
        kvdb.incrCounter( `opengrowth.${key}.${y}_${m}`,           1 );
        kvdb.incrCounter( `opengrowth.${key}.${y}_${m}_${d}`,      1 );
        kvdb.incrCounter( `opengrowth.${key}.${y}_${m}_${d}_${h}`, 1 );

        // Librato
        return opengrowth.track.librato( `opengrowth.${key}`, value );
    } );
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Librato
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.track.librato = ( key, value ) => {
    // Skip if missing your Librato API Keys
    if (!opengrowth.keys.librato.email || !opengrowth.keys.librato.secret)
        return (new Promise()).resolve('Librato disabled. No API Key.');

    // Librato for `opengrowth.${key}`.
    const data = [
        `source=pubnub-blocks`
    ,   `period=60`
    ,   `gauges[0][name]=${key}`
    ,   `gauges[0][value]=${value}`
    ].join('&');

    // B64 Encode Auth Header
    const libauth = auth.basic(
        opengrowth.keys.librato.email
    ,   opengrowth.keys.librato.secret
    );

    // Create Auth Header
    const headers = {
        'Authorization' : libauth
    ,   'Content-Type'  : 'application/x-www-form-urlencoded'
    };

    // Send Recording to Librato
    return http.fetch( 'https://metrics-api.librato.com/v1/metrics', {
        method  : 'POST'
    ,   body    : data
    ,   headers : headers
    } ).catch((err) => {
        //console.log( 'Librato Error:', err );
    });
};

opengrowth.track.signal = ( signal, data ) => {
    // TODO
    // TODO log signal to MySQL
    // TODO 
};
opengrowth.track.delight = ( delight, signal, data ) => {
    // TODO
    // TODO log delight to MySQL
    // TODO 
};
opengrowth.track.reaction = (key) => {
    // TODO
    // TODO log reaction to MySQL
    // TODO 
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Vendors
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight = {};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Send Emails with Pardot
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.pardot = {};
opengrowth.delight.pardot.email = ( signal, message, email, subject ) => {
    opengrowth.track( signal, message, email );
    // ⚠️  opengrowth.keys.sendgrid.apikey
    // TODO send email with pardot/sendgrid
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Send Emails with SendGrid
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.sendgrid = {};
opengrowth.delight.sendgrid.email = ( signal, message, email, subject ) => {
    opengrowth.track( signal, message, email );
    // ⚠️  opengrowth.keys.sendgrid.apikey
    // TODO send email with pardot/sendgrid
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Send SMS with RingCentral
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.ringcentral = {};
opengrowth.delight.ringcentral.sms = ( signal, message, phone ) => {
    opengrowth.track( signal, message, phone );
    // ⚠️  opengrowth.keys.ringcentral.apikey
    // TODO send SMS on RingCentral
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Send SMS with Twilio
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.twilio = {};
opengrowth.delight.twilio.sms = ( signal, message, phone ) => {
    opengrowth.track( signal, message, phone );
    // ⚠️  opengrowth.keys.twilio.apikey
    // TODO send SMS on Twilio
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Tweet at Customer
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.twitter = {};
opengrowth.delight.twitter.tweet = ( signal, message ) => {
    opengrowth.track( signal, message );
    // ⚠️  opengrowth.keys.twitter.keys
    // TODO Tweet on Twitter
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Send Snap to User
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.snapchat = {};
opengrowth.delight.snapchat.snap = ( signal, message, userid ) => {
    opengrowth.track( signal, message, userid );
    // ⚠️  opengrowth.keys.snapchat.a-thing...
    // TODO Send a Snap 
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Post to Customer on LinkedIn
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.linkedin = {};
opengrowth.delight.linkedin.post = ( signal, message ) => {
    opengrowth.track( signal, message );
    // ⚠️  opengrowth.keys.linkedin.keys
    // TODO Post on LinkedIn
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Post on Customer's Wall on Facebook
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.facebook = {};
opengrowth.delight.facebook.post = ( signal, message ) => {
    opengrowth.track( signal, message );
    // ⚠️  opengrowth.keys.facebook.keys
    // TODO FB Post
};
