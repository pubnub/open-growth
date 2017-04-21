// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Leverage a Classifier with MonekyLearn
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.modules.monkeylearn = {};
opengrowth.modules.monkeylearn.classify = ( input, classifier ) => {

    // Skip if missing API Keys
    if (!opengrowth.keys.monkeylearn.apikey) {
        console.log("NO ML API KEY");
         return (new Promise()).resolve({
            email   : email
        ,   message : 'MonkeyLearn disabled. No API Key.'
        });
    }

    console.log('monkeylearn xhr about to commence');

    // B64 Encode Auth Header
    const libauth = `token ${opengrowth.keys.monkeylearn.apikey}`;
    const domain  = 'api.monkeylearn.com';
    const data    = { "text_list" : [input] };
    const url     = 'https://' + domain +
                    '/v2/classifiers/' + classifier +
                    '/classify/';

    // Get Data
    return new Promise( ( resolve, reject ) => {
        console.log('monkeylearn xhr commencing');
        xhr.fetch( url, {
            "method"  : 'POST',
            "body"    : data,
            "headers" : { 'Authorization' : libauth },
            "timeout" : 5000
        }).then( res => {
            if ( res.status >= 200 && res.status < 300 ) {
                // console.log("MonkeyLearn Response:\n", res );
                opengrowth.log("monkeylearn", "xhr", res.status);
                resolve(JSON.parse(res.body).result[0][0]);
            }
            else {
                // console.log("MonkeyLearn Error:\n", res );
                opengrowth.log("monkeylearn", "xhr", res, true);
                resolve({});
            }
        }).catch( err => {
            // console.log("MonkeyLearn Error:\n", err );
            opengrowth.log("monkeylearn", "xhr", err, true);
            resolve({});
        });
    } );
};
