// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Librato
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.modules.librato = ( libratoUpdates ) => {
    // Skip if missing your Librato API Keys
    if ( !opengrowth.keys.librato.email || !opengrowth.keys.librato.secret ) {
        return Promise.resolve('Librato disabled. No API Key.');
    }

    let apiUrl = 'https://metrics-api.librato.com/v1/metrics';

    // Librato for `opengrowth.${key}`.
    let data = [
        `source=pubnub-blocks`
    ,   `period=60`
    ].join('&');

    let index = 0;
    for ( let key in libratoUpdates ) {
        data += "&" + `gauges[${index}][name]=${key}` +
            "&" +
            `gauges[${index}][value]=${libratoUpdates[key]}`;
        index++;
    }
    
    // @if ENV = 'Silver'
    // Mark gauges from this testing instance with 'silver'
    data = data.replace(/opengrowth\./g,'opengrowth.silver.');
    // @endif

    // @if ENV = 'Bronze'
    // Mark gauges from this testing instance with 'bronze'
    data = data.replace(/opengrowth\./g,'opengrowth.bronze.');
    // @endif

    // B64 Encode Auth Header
    const libauth = auth.basic(
        opengrowth.keys.librato.email
    ,   opengrowth.keys.librato.secret
    );

    // Send Recording to Librato
    return new Promise( ( resolve, reject ) => {
        let errorHandler = err => {
            // console.log("Librato Error:\n", err);
            let error = err ? err.body || err.statusText || err.status : null;
            opengrowth.log("librato", "xhr", error, true);
            resolve({});
        };

        xhr.fetch( apiUrl, {
            "method"  : 'POST',
            "body"    : data,
            "headers" : {
                "Authorization" : libauth,
                "Content-Type"  : "application/x-www-form-urlencoded"
            },
            "timeout" : 6000
        })
        .then( res => {
            if ( res.status >= 200 && res.status < 300 ) {
                // console.log("Librato Response:\n", res );
                opengrowth.log("librato", "xhr", res.status);
            }
            else {
                errorHandler(res);
            }
        })
        .catch(errorHandler);
    });
};
