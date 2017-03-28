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
    var delimiter;

    if ( url.indexOf("&link=") > -1 ) {
        delimiter = "&";
    }
    else if ( url.indexOf("?link=") > -1 ) {
        delimiter = "?";
    }
    else {
        return "unlabeled";
    }

    var parameters = url.split(delimiter+"link=")[1];
    var kv = parameters.split(/&|=/);
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
            console.log( action );
            // Add unsubscribes and resubscribes to publish
            if ( action.event === "group_unsubscribe" ) {
                action.category = [ "og_unsubscribe" ];
            }

            if ( action.event === "group_resubscribe" ) {
                action.category = [ "og_resubscribe" ];
            }

            //only track open growth emails that have "og_" in category
            //no tracking for default bcc
            var category = action.category || [""];

            if ( category[0].indexOf("og_") < 0 ||
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