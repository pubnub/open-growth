// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Libs
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var config = require('./config')
var pubnub = require('pubnub')

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Salesforce
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
module.exports = function (app) {
    app.get( '/sendgrid/', function( request, response ) {

        var pn = new pubnub({
              "publishKey"   : config.pubkey
            , "subscribeKey" : config.subkey
            , "secretKey"    : config.seckey
        });
        
        pn.publish({
              "channel" : "sg_analytics"
            , "message" : request
        });

        //tell sendgrid 200 ok.
        response.send(200);
    });
};
