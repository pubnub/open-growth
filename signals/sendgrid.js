opengrowth.signals.sendgrid = ( request ) => {
    for (let msg of request.body) {
        if (msg.event === "click") {
            let parameters = msg.url.split(/&signal=/)[1];
            let kv = parameters.split(/&|=/);
            let signal = kv[0];
            let link = kv[2]; //key set or docs
            opengrowth.track.signal(`sigunup.link.${link}`, 1);
        }

        if (msg.event === "open") {
            opengrowth.track.signal("signup.open", 1);
        }
    }
};
