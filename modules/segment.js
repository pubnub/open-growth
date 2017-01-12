// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Segment IO
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.modules.segment = (batch) => {
    // Skip if missing your Segment API Keys
    if (!opengrowth.keys.segment.writekey)
        return (new Promise()).resolve('SegmentIO disabled. No API Key.');

    // B64 Encode Auth Header
    const libauth = auth.basic( opengrowth.keys.segment.writekey, '' );

    // Create Auth Header
    const headers = {
        'Authorization' : libauth
    ,   'Content-Type'  : 'application/json'
    };

    // Send Recording to Segment IO
    return xhr.fetch( 'https://api.segment.io/v1/batch', {
        method  : 'POST'
    ,   body    : batch
    ,   headers : headers
    } ).catch((err) => {
        console.log( 'Segment Error:', err );
    });
};
