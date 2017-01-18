// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Librato
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.modules.librato = ( key, value ) => {
    // Skip if missing your Librato API Keys
    if (!opengrowth.keys.librato.email || !opengrowth.keys.librato.secret)
        return (new Promise()).resolve('Librato disabled. No API Key.');

    // Librato for `opengrowth.${key}`.
    const data = [
        `source=pubnub-blocks`
    ,   `period=60`
    ,   `gauges[0][name]=${key}`
    ,   `gauges[0][value]=${value}`
    ].join('&');

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
    
    // Send Recording to Librato
    return xhr.fetch( 'https://metrics-api.librato.com/v1/metrics', {
        method  : 'POST'
    ,   body    : data
    ,   headers : headers
    } ).catch((err) => {
        console.log( 'Librato Error:', err );
    });
};
