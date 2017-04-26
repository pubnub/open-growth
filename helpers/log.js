// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Append a log entry to the list of logs
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.log = ( type, event, message, isError ) => {
    if ( message instanceof Error ) {
        message = message.toString();
    }
    else if ( message instanceof Response ) {
        //message = JSON.parse(JSON.stringify(message));
        message = {
            "body"    : message.body,
            "headers" : message.headers,
            "url"     : message.url,
            "status"  : message.status
        };
    }

    let log = {
        "ts"      : Math.floor(Date.now()/1000)
      , "type"    : type
      , "event"   : event
      , "message" : message
    };

    if ( isError ) log.error = true;
    
    opengrowth.logs.push(log);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Publishes logs to logging channel
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.publishLogs = () => {
    return new Promise( ( resolve, reject ) => {
        if ( !opengrowth.logs.length ) return resolve();
        
        pubnub.publish({
            "channel": "opengrowth.log",
            "message": {
                "ts"  : Math.floor(Date.now()/1000),
                "log" : opengrowth.logs
            }
        }).then(resolve)
        .catch(reject);
    });
};
