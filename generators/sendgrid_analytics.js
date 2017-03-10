// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Libs
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var config = require('./config')
var pubnub = require('pubnub')
var bodyParser = require('body-parser')

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Globals
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var default_bcc = "open-growth-activity";

// Returns a string of the link name that was clicked in an email
var getUrlLabel = function ( url ) {
    console.log(url);
    var delimiter;

    if ( url.indexOf("&amp;link=") > -1 ) {
        delimiter = "&amp;";
    }
    else if ( url.indexOf("?link=") > -1 ) {
        delimiter = "?";
    }
    else {
        return "unlabeled";
    }

    var parameters = url.split(delimiter+"link=")[1];
    var kv = parameters.split(/&amp;|=/);
    var link = kv[0];
    return link;
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// SendGrid
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
module.exports = function ( app ) {
    // Tell express to use the body-parser middleware
    app.use(bodyParser.json());

    app.post( '/sendgrid', function( request, response ) {

        var actions = [];
        for ( var action of request.body ) {
            //only open growth emails have categories
            //no analytics tracking for default bcc
            if ( !action.category ||
                 action.email.indexOf(default_bcc) > -1 ) {
                continue;
            }

            var formattedAction = {
                "email"    : action.email,
                "category" : action.category,
                "event"    : action.event
            };

            if ( action.url ) {
                formattedAction["url"] = getUrlLabel(action.url);
            }

            actions.push(formattedAction);
        }

        if ( actions.length === 0 ) {
            response.sendStatus(200);
            return;
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