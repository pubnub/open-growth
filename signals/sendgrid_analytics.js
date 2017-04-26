// Tracks SendGrid Updates from the Heroku sendgrid_analytics generator

opengrowth.signals.sendgrid_analytics = ( request ) => {
    // Tracks status of an email sent to a customer through SendGrid
    const categoryEvent = ( action ) => {
        opengrowth.track.reaction(`sendgrid_analytics.${action.category}.${action.event}`, "swu-event-webhook");
        let message = getLogMessage(action);
        opengrowth.log("sendwithus.email", "reaction", message);
    }

    // Tracks a clicked link event in a SendGrid email
    const signalLink = ( action ) => {
        opengrowth.track.reaction(`sendgrid_analytics.${action.category}.click.${action.url}`, "swu-event-webhook");
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