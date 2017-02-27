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

    // Copy publishes to Silver        
    // @if GOLD        
    opengrowth.modules.pubnub.silver(message);     
    // @endif

    // Record the signal!
    opengrowth.track.signal( signal, message );

    // TODO special track signal 'reaction' for extra metrics
    // TODO send to SQL DB
    
    // Track in-line Processed Flag
    request.message.processed = { started : true };
    
    // Ignore if not a customer delight
    if (!email) return request.ok(); 

    // Process Customer Delight
    return opengrowth.customer.getCustomer( email, signal ).then( customer => {
        return kvdb.set( email, customer ).then( result => {
            request.message.processed.completed = true;
            return request.ok();
        } );
    } );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Modules that Augment and Enhance with ML and AI
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.modules = {};
