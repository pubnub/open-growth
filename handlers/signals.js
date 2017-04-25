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
const Response = require('response');

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Open Growth Signals Event Handler - Before Publish or Fire
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
export default request => {
    console.log('executing the before handler - signals');
    // Accept incoming email analytics from SendGrid.com
    // move the POST body to the "actions" property in the message
    if ( request.params.sendgrid_analytics ) {
        request.message = {
            "signal"  : "sendgrid_analytics",
            "actions" : request.message
        };
    }

    // @if !GOLD
    // No deduplication on testing envs 
    request.message.dedupe = false;
    // @endif

    const message = request.message;
    const signal  = message.signal;
    const email   = message.email;

    let initialCustomerData = {
        "email"       : message.email,
        "firstName"   : message.firstName,
        "lastName"    : message.lastName,
        "phone"       : message.phone,
        "company"     : message.company,
        "description" : message.description,
        "useCase"     : message.useCase
    };

    // Where logs are stored during this EH execution
    opengrowth.logs = [];

    // Real-time monitoring updates configured for Librato by default
    opengrowth.rtmUpdates = {};

    // Record the signal
    opengrowth.track.signal(signal, message);

    // Track in-line Processed Flag
    request.message.processed = { started: true };

    // Common tasks to perform at the end of this event handler
    let done = () => {
        console.log('done');
        console.log(opengrowth.logs);
        request.message.logs = opengrowth.logs;
        request.message.rtmUpdates = opengrowth.rtmUpdates;
        request.message.processed.completed = true;
        return request.ok();
    };

    // If there is no email address, we can't enrich with ClearBit
    // Continue to the After Event Handler
    if ( !email ) return done();

    // Enrich the Customer Data with Clearbit
    // Attempt to determine the company's Use Case using MonkeyLearn
    let customer = {};

    // Check for duplicate signal to prevent customers
    // receiving duplicate delights
    return kvdb.get(email, `delight-${signal}-${email}`)
    .then( duplicate => {
        request.message.kvRecord = duplicate;
        if ( duplicate && !( message.dedupe === false ) ) {
            // Abort, this is a duplicate signal
            // the After EH will record the activity
            return done();
        }
        else {
            // Clearbit lookup
            return opengrowth.customer.getDataFromClearbit(email);
        }
    })
    .then( clearbitCustomerData => {
    console.log('clearbitCustomerData ',!!clearbitCustomerData);
        // Enrich the customer object with ClearBit data
        customer = opengrowth.customer.enrich(
            initialCustomerData,
            clearbitCustomerData
        );

        // Find a Use Case with MonkeyLearn if 
        // any company description is available
        return opengrowth.customer.getUseCase(customer);
    })
    .then( useCase => {
        console.log('useCase ',useCase);

        // Set use case if MonkeyLearn determined it
        if ( useCase ) {
            customer.useCase = useCase;
        }

        // Store customer data in message body
        request.message.customer = customer;

        return done();
    });
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Modules that Augment and Enhance with ML and AI
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.modules = {};
