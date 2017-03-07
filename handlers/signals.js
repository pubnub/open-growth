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

    // Where logs are stored during before publish EH execution
    opengrowth.logs = [];
    opengrowth.libratoUpdates = {};

    // Record the signal!
    opengrowth.track.signal( signal, message );

    // TODO special track signal 'reaction' for extra metrics
    // TODO send to SQL DB
    
    // Track in-line Processed Flag
    request.message.processed = { started : true };
    
    // Ignore if not a customer delight
    if (!email) {
        return opengrowth.modules.librato(opengrowth.libratoUpdates)
        .then(() => {
            return opengrowth.publishLogs();
        }).then(() => {
            request.message.processed.completed = true;
            return request.ok();
        });
    }

    // Process Customer Delight
    return opengrowth.customer.getCustomer( email, signal ).then( customer => {
        let toStore = {
            "customer" : customer,
            "logs"     : opengrowth.logs
        };
        return kvdb.set( email, toStore ).then( result => {
            return opengrowth.modules.librato(opengrowth.libratoUpdates);
        } ).then( () => {
            request.message.processed.completed = true;
            return request.ok();
        });
    } );
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Modules that Augment and Enhance with ML and AI
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.modules = {};
