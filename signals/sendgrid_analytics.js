opengrowth.signals.sendgrid_analytics = ( request ) => {
    // Tracks status of an email sent to a customer through SendGrid
    const categoryEvent = ( action ) => {
        log(action.event, action.category, action.email);
        opengrowth.track.signal(`sendgrid_analytics.${action.category}.${action.event}`);
    }

    // Tracks a clicked link event in a SendGrid email
    const signalLink = ( action ) => {
        let link = getUrlParams(action.url);
        log(action.event, action.category, action.email, link);
        opengrowth.track.signal(`sendgrid_analytics.${action.category}.link.${link}`);
    }

    // Returns a string of the link name that was clicked in an email
    const getUrlParams = ( url ) => {
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

        let parameters = url.split(delimiter+"link=")[1];
        let kv = parameters.split(/&|=/);
        let link = kv[0];
        return link;
    }

    // Send all updates to logging channel
    const log = ( event, category, email, link ) => {
        var logObj = {
             "action" : event
          , "delight" : "sendgrid_analytics"
          ,  "signal" : category
          ,   "email" : email
          ,    "link" : link
        }
        opengrowth.log(logObj);
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