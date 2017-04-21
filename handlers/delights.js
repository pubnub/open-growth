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
// Open Growth Delights Handler
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
export default request => {
    const message = request.message;
    const signal  = message.signal;
    const email   = message.email;

    // Gets published to logging channel at the end of After Publish EH
    opengrowth.logs = [];
    opengrowth.libratoUpdates = {};

    // Common final tasks for this event handler, to be call last
    let done = () => {
        return opengrowth.modules.librato(opengrowth.libratoUpdates)
        .then(() => {
            return opengrowth.publishLogs();
        }).then(() => {
            request.message.processed.completed = true;
            return request.ok();
        });
    };

    // Unhandled Signals
    if ( !opengrowth.signals[signal] ) {
        opengrowth.track.signal( `unhandled.${signal}`, message );
        return done();
    }

    // When processing a Non-delight
    // such as running ./signals/import.js then
    // we don't need to lookup a customer record
    if ( !email ) {
        //opengrowth.track.signal( `no-email.${signal}`, message );
        return opengrowth.signals[signal]( request )
        .then( () => { return done() });
    }

    // @if !GOLD
    // No deduplication on testing envs 
    message.dedupe = false;
    // @endif

    // Get Saved Clearbit / Customer Data
    return kvdb.get(email)
    .then( stored => {
        stored = stored ? stored : {};

        let customer    = stored.customer;
        opengrowth.logs = opengrowth.logs.concat(stored.logs || []);

        // We don't want to send the same Delight twice!
        // Check for Duplicate Delight Signal
        const duplicate_key = `delight-${signal}-${email}`;
        // Set TTL of 720 hours
        const duplicate_ttl = request.message.ttl || 720 * 60;

        return kvdb.get(duplicate_key).then( duplicate => {
            // Duplicate Detected 
            // Abort and Track in Librato
            if ( duplicate && !(message.dedupe === false) ) {
                opengrowth.track.delight(
                    `duplicate.${signal}`
                ,   signal
                ,   customer
                );
                return done();
            } else {
                // Record Activity so we can prevent future duplicates
                // Then run the signal's delight handler.
                return kvdb.set( duplicate_key, true, duplicate_ttl )
                .then( () => {
                    // Run the signal's delight handler 
                    // This is in /signals/ directory
                    return opengrowth.signals[signal]( request, customer )
                    .then( () => { return done() });
                });
            }
        });
    });
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

