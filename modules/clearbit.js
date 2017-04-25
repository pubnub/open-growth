// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Lookup Customers with Clearbit
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.modules.clearbit = {};
opengrowth.modules.clearbit.lookup = email => {
    // Skip if missing API Keys
    if ( !opengrowth.keys.clearbit.apikey ) {
        console.log("Clearbit Error:\n", "Missing API Key");
        opengrowth.log("clearbit", "xhr", "Missing API Key", true);
        return Promise.resolve({});
    }

    // B64 Encode Auth Header
    const libauth    = auth.basic( opengrowth.keys.clearbit.apikey, '' );
    const requestUrl = '' +
        'https://person-stream.clearbit.com/v2/combined/find?email=' + email;

    // Get Customer Bio
    return new Promise( ( resolve, reject ) => {
        let errorHandler = err => {
            console.log("Clearbit Error:\n", err);
            opengrowth.log("clearbit", "xhr", err, true);
            resolve({});
        };

        xhr.fetch( requestUrl, {
            "method"  : 'GET',
            "headers" : { 'Authorization' : libauth }
            //,"timeout" : 2500
        }).then( res => {
            if ( res.status >= 200 && res.status < 300 ) {
                // console.log("Clearbit Response:\n", res);
                opengrowth.log("clearbit", "xhr", res.status);
                resolve({
                    "customer" : JSON.parse(res.body),
                    "status"   : res.status
                });
            }
            else {
                errorHandler(res);
            }
        }).catch(errorHandler);
    } );

};

