opengrowth.signals.sendgrid = ( request ) => {
    for (var action of request.body) {
        handlers[action.event](action);
    }

    function categoryEvent ( action ) {
        opengrowth.track.signal("sg.${action.category}.{action.event}", 1);
    }

    function signalLink ( action ) {
        params = getUrlParams(action.url);
        opengrowth.track.signal(`sg.${params.signal}.link.${params.link}`, 1);
    }

    function getUrlParams ( url ) {
        let parameters = url.split(/&signal=/)[1];
        let kv = parameters.split(/&|=/);
        let signal = kv[0];
        let link = kv[2]; //key set or docs
        return { "signal" : signal, "link" : link };
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
};
