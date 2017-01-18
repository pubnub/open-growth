opengrowth.signals.sendgrid_analytics = ( request ) => {
    const categoryEvent = ( action ) => {
        opengrowth.track.signal(`sendgrid_analytics.${action.category}.${action.event}`);
    }

    const signalLink = ( action ) => {
        let link = getUrlParams(action.url);
        opengrowth.track.signal(`sendgrid_analytics.${action.category}.link.${link}`);
    }

    const getUrlParams = ( url ) => {
        let parameters = url.split("/&link=/")[1];
        let kv = parameters.split("/&|=/");
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

    for (var action of request.message.body) {
        //only open growth emails have a category property
        if (action.category) {
            handlers[action.event](action);
        }
    }
    return request.ok();
};
