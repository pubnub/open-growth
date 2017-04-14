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
// Open Growth Signals Handler - Before Publish or Fire
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
export default request => {
    // Accept incoming email analytics from SendGrid.com
    if ( request.params.sendgrid_analytics ) {
        request.message = { "actions" : request.message };
        request.message.signal = "sendgrid_analytics";
    }

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
        "usecase"     : message.usecase
    };

    // Where logs are stored during this EH execution
    opengrowth.logs = [];
    opengrowth.libratoUpdates = {};

    // Record the signal
    opengrowth.track.signal(signal, message);

    // Track in-line Processed Flag
    request.message.processed = { started: true };

    if ( !email ) {
        // Update Librato
        return opengrowth.modules.librato(opengrowth.libratoUpdates)
        .then( () => {
            // Publish Logs to logging channel
            return opengrowth.publishLogs();
        }).then( () => {
            request.message.processed.completed = true;
            return request.ok();
        });
    }

    // Enrich the Customer Data with Clearbit
    // Attempt to determine the company's Use Case
    // using MonkeyLearn if a description is available
    let customer = {};
    // Clearbit lookup
    opengrowth.customer.getDataFromClearbit(email)
    .then( clearbitCustomerData => {
        // Enrich the customer object with ClearBit data
        return opengrowth.customer.enrich(
            initialCustomerData,
            clearbitCustomerData
        );
    })
    .then( enrichedCustomer => {
        // ClearBit Data takes precedence over signup data
        customer = enrichedCustomer;

        // Find a Use Case with MonkeyLearn if 
        // a company description is available
        return opengrowth.customer.getUseCase(customer);
    })
    .then( usecase => {

        // Set Use Case if available
        if ( usecase ) {
            customer.usecase = usecase;
        }

        // Store customer data in KV Store to use in after EH
        let toStore = {
            "customer": customer,
            "logs": opengrowth.logs
        };

        return kvdb.set(email, toStore);
    })
    .then( () => {
        // Update Librato
        return opengrowth.modules.librato(opengrowth.libratoUpdates);
    });

    request.message.processed.completed = true;
    return request.ok();
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Modules that Augment and Enhance with ML and AI
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.modules = {};
