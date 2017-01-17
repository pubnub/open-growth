opengrowth.signals.sendgrid = ( request ) => {

    function categoryEvent ( action ) {
        console.log(`sg.${action.category}.${action.event}`);
        opengrowth.track.signal(`sg.${action.category}.${action.event}`, 1);
    }

    function signalLink ( action ) {
        params = getUrlParams(action.url);
        console.log(`sg.${params.signal}.link.${params.link}`);
        opengrowth.track.signal(`sg.${params.signal}.link.${params.link}`, 1);
    }

    function getUrlParams ( url ) {
        let parameters = url.split(/&link=/)[1];
        let kv = parameters.split(/&|=/);
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
};
