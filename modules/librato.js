// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Librato
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.modules.librato = ( libratoUpdates ) => {
    // Skip if missing your Librato API Keys
    if (!opengrowth.keys.librato.email || !opengrowth.keys.librato.secret)
        return (new Promise()).resolve('Librato disabled. No API Key.');

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
    
    // @if !GOLD
    // Mark gauges from testing instance with 'silver'
    data = data.replace(/opengrowth\./g,'opengrowth.silver.');
    // @endif

    // B64 Encode Auth Header
    const libauth = auth.basic(
        opengrowth.keys.librato.email
    ,   opengrowth.keys.librato.secret
    );

    // Create Auth Header
    const headers = {
        'Authorization' : libauth
    ,   'Content-Type'  : 'application/x-www-form-urlencoded'
    };

    const body = {
        "method"  : 'POST'
    ,   "body"    : data
    ,   "headers" : headers
    };

    // Send Recording to Librato
    return xhr.fetch( apiUrl, body )
    .then((res) => {
        if ( res.status >= 200 && res.status < 300 ) {
            //console.log("Librato Response:\n", res );
            opengrowth.log("librato", "xhr", res.status);
        }
        else {
            console.log("Librato Error:\n", res );
            opengrowth.log("librato", "xhr", res, true);
        }
    })
    .catch((err) => {
        console.log("Librato Error:\n", err );
        opengrowth.log("librato", "xhr", err, true);
    });
};
