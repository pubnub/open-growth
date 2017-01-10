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
    // Tell express to use the body-parser middleware and to not parse extended bodies
    app.use(bodyParser.urlencoded({ extended: false }))

    app.post( '/sendgrid/', function( request, response ) {
        var pn = new pubnub({
              "publishKey"   : process.env.TESTPUBKEY
            , "subscribeKey" : process.env.TESTSUBKEY
        });
        
        pn.publish({
              "channel" : "sg_analytics"
            , "message" : request.body
        });

        //tell sendgrid 200 ok.
        response.send(200);
    });
};
