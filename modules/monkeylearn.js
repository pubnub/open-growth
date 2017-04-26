// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Leverage a Classifier with MonekyLearn
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.modules.monkeylearn = {};
opengrowth.modules.monkeylearn.classify = ( input, classifier ) => {

    // Skip if missing API Keys
    if ( !opengrowth.keys.monkeylearn.apikey ) {
        console.log("MonkeyLearn Error:\n", "Missing API Key");
        opengrowth.log("monkeylearn", "xhr", "Missing API Key", true);
        return Promise.resolve({});
    }

    // B64 Encode Auth Header
    const libauth = `token ${opengrowth.keys.monkeylearn.apikey}`;
    const domain  = 'api.monkeylearn.com';
    const data    = { "text_list" : [input] };
    const url     = 'https://' + domain +
                    '/v2/classifiers/' + classifier +
                    '/classify/';

    // Get Data
    return new Promise( ( resolve, reject ) => {
        let errorHandler = err => {
            // console.log("MonkeyLearn Error:\n", err);
            let error = err ? err.body || err.statusText || err.status : null;
            opengrowth.log("monkeylearn", "xhr", error, true);
            resolve({});
        };

        xhr.fetch( url, {
            "method"  : 'POST',
            "body"    : data,
            "headers" : { 'Authorization' : libauth },
            "timeout" : 6000
        })
        .then( res => {
            if ( res.status >= 200 && res.status < 300 ) {
                // console.log("MonkeyLearn Response:\n", res );
                opengrowth.log("monkeylearn", "xhr", res.status);
                resolve(JSON.parse(res.body).result[0][0]);
            }
            else {
                errorHandler(res);
            }
        })
        .catch(errorHandler);
    });
};
