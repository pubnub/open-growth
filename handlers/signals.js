// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Open Growth Framework
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var opengrowth = {};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Libs
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const http = require('xhr');

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Open Growth Signals Handler
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
export default request => {
    const message = request.message;
    const signal  = message.signal;
    const email   = message.email;

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
    // 
    // TODO
    // increment KV for `opengrowth.${key}`.
    // increment KV for `opengrowth.${key}.yyyy`.
    // increment KV for `opengrowth.${key}.yyyy_mm`.
    // increment KV for `opengrowth.${key}.yyyy_mm_dd`.
    // increment KV for `opengrowth.${key}.yyyy_mm_dd_hh`.

    // increment Librato for `opengrowth.${key}`.
    xhr.fetch('https://metrics-api.librato.com/v1/metrics').then((serverResponse) => {
        // handle server response
    }).catch((err) => {
        // handle request failure
    });
};
opengrowth.track.signal = ( signal, data ) => {
    // TODO
    // TODO log signal
    // TODO 
};
opengrowth.track.delight = ( delight, signal, data ) => {
};
opengrowth.track.reaction = (key) => {
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
