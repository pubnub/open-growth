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
        //only open growth emails have categories
        if (!action.category) {
            response.sendStatus(200);
            return; 
        }

        var actions = [];
        for (var action of request.body) {
            actions.push({
                "email"    : action.email,
                "category" : action.category,
                "event"    : action.event,
                "url"      : action.url
            });
        }

        var message = {
            "signal"    : "sendgrid_analytics",
            "actions"   : actions
        };

        var pn = new pubnub({
              "publishKey"   : config.pubkey
            , "subscribeKey" : config.subkey
        });
        
        pn.publish({
              "channel" : config.ogchan
            , "message" : message
        });

        //tell sendgrid 200 ok.
        response.sendStatus(200);
    });
};