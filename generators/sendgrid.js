// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Libs
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var config = require('./config')
var pubnub = require('pubnub')

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Salesforce
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
module.exports = function (app) {
    app.post( '/sendgrid/', function( request, response ) {
        console.log(request.body);

        // var pn = new pubnub({
        //       "publishKey"   : process.env.TESTPUBKEY
        //     , "subscribeKey" : process.env.TESTSUBKEY
        // });
        
        // pn.publish({
        //       "channel" : "sg_analytics"
        //     , "message" : request
        // });

        //tell sendgrid 200 ok.
        response.send(200);
    });
};
