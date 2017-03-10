opengrowth.signals.sendgrid_analytics = ( request ) => {
    // Tracks status of an email sent to a customer through SendGrid
    const categoryEvent = ( action ) => {
        opengrowth.track.signal(`sendgrid_analytics.${action.category}.${action.event}`);
        let message = getLogMessage(action);
        opengrowth.log("sendwithus.email", "reaction", message);
    }

    // Tracks a clicked link event in a SendGrid email
    const signalLink = ( action ) => {
        action.url = getUrlParams(action.url);
        opengrowth.track.signal(`sendgrid_analytics.${action.category}.link.${action.url}`);
        let message = getLogMessage(action);
        opengrowth.log("sendwithus.email", "reaction", message);
    }

    // Parses Reaction data for logs
    let getLogMessage = ( action ) => {
        let log = {
            "contact" : action.email
        ,   "delight" : "sendwithus.email"
        ,   "signal"  : action.category
        ,   "type"    : action.event
        };

        if ( action.url ) log["message"] = action.url;

        return log;
    };

    // Returns a string of the link name that was clicked in an email
    const getUrlParams = ( url ) => {
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

        let parameters = url.split(delimiter+"link=")[1];
        let kv = parameters.split(/&amp;|=/);
        let link = kv[0];
        return link;
    }

    var handlers = {
          "click"             : signalLink
        , "open"              : categoryEvent
        , "processed"         : categoryEvent
        , "deferred"          : categoryEvent
        , "delivered"         : categoryEvent
        , "bounce"            : categoryEvent
        , "dropped"           : categoryEvent
        , "spamreport"        : categoryEvent
        , "unsubscribe"       : categoryEvent
        , "group_unsubscribe" : signalLink
        , "group_resubscribe" : signalLink
    };

    for ( var action of request.message.actions ) {
        //only open growth emails have a category property
        if ( action.category ) {
            action.category = action.category[0];
            handlers[action.event](action);
        }
    }
    return request.ok();
};