// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Libs
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var config = require('./config')
var pubnub = require('pubnub')
var bodyParser = require('body-parser')

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// SendGrid
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
module.exports = function (app) {
    // Tell express to use the body-parser middleware
    app.use(bodyParser.json());

    app.post( '/sendgrid', function( request, response ) {
        var pn = new pubnub({
              "publishKey"   : process.env.PN_PUB
            , "subscribeKey" : process.env.PN_SUB
        });
        
        pn.publish({
              "channel" : process.env.PN_CHANNEL
            , "message" : request.body
        });

        //tell sendgrid 200 ok.
        response.sendStatus(200);
    });
};