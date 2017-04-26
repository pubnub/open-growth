// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Append a log entry to the list of logs
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.log = ( type, event, message, isError ) => {

    // No need to log buffers of API responses
    if ( message.constructor === Object ) {
        delete message['buffer'];
        delete message['$buffer'];
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
