// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Append a log entry to the list of logs
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.log = ( type, event, message, isError ) => {
    let log = {
        "ts"      : Math.floor(new Date().getTime()/1000)
      , "type"    : type
      , "event"   : event
      , "message" : message
    };
    if (isError) log.error = true; 
    opengrowth.logs.push(log);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Publishes logs to logging channel
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.publishLogs = () => {
    return new Promise(( resolve, reject ) => {
        if (!opengrowth.logs.length) resolve();

        let channel = "opengrowth.log";
        // @if !GOLD
        // Silver Logs
        channel = "opengrowth.log-silver";
        // @endif

        pubnub.publish({
            "channel": channel,
            "message": {
                "log" : opengrowth.logs,
                "ts"  : Math.floor(new Date().getTime()/1000)
            }
        }).then((res) => {
            resolve();
        }).catch((err) => {
            reject();
        });
    });
};
