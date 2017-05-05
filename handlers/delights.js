// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Open Growth Framework
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var opengrowth = {};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Libs
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const xhr      = require('xhr');
const kvdb     = require('kvstore');
const auth     = require('codec/auth');
const base64   = require('codec/base64');
const crypto   = require('crypto');
const pubnub   = require('pubnub');
const query    = require('codec/query_string');

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Open Growth Delights Event Handler - After Publish or Fire
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
export default ( request ) => {
    const message  = request.message;
    const signal   = message.signal;
    const email    = message.email;
    const customer = message.customer;

    // Gets published to logging channel during done()
    opengrowth.logs       = message.logs || [];
    opengrowth.rtmUpdates = message.rtmUpdates || {};

    // Common tasks to perform at the end of this event handler
    let done = () => {
        opengrowth.log(
            "librato",
            "rtmUpdates",
            opengrowth.rtmUpdates
        );
        return opengrowth.publishLogs()
        .then( () => {
            request.message.processed.completed = true;
            return request.ok();
        });
    };

    // Track if this is an unhandled Signal
    if ( !opengrowth.signals[signal] ) {
        opengrowth.track.signal( `unhandled.${signal}`, message );
        return done();
    }

    // Track if this is a duplicate customer Delight Signal
    // complete logging without resending the Delight
    if ( message.kvRecord && !( message.dedupe === false ) ) {
        opengrowth.track.delight(
            `duplicate.${signal}`,
            signal,
            customer
        );
        return done();
    }

    // Execute signal right away if it is not a customer specific delight
    // No need to track it in KV Store for Deduplication
    if ( !email ) {
        return opengrowth.signals[signal](request)
        .then(done);
    }

    // Record Delight in KV Store to prevent sending a customer
    // the same delight more than once
    const delightRecordkey = `delight-${signal}-${email}`;

    // Set TTL of 1 month
    const delightRecordTtl = request.message.ttl || 720 * 60;

    return kvdb.set(delightRecordkey, true, delightRecordTtl)
    .then( ( storeError ) => {
        if ( storeError ) {
            opengrowth.track.error('kvstore.failure', storeError);
        }
        else {
            return opengrowth.signals[signal]( request, customer );
        }
    })
    .then(done);
};

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
