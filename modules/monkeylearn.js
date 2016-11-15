// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Leverage a Classifier with MonekyLearn
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.modules.monkeylearn = {};
opengrowth.modules.monkeylearn.classify = ( input, classifier ) => {

    // Skip if missing API Keys
    if (!opengrowth.keys.monkeylearn.apikey) return (new Promise()).resolve({
        email   : email
    ,   message : 'MonkeyLearn disabled. No API Key.'
    });

    // B64 Encode Auth Header
    const libauth = `token ${opengrowth.keys.monkeylearn.apikey}`;
    const domain  = 'api.monkeylearn.com';
    const data    = { "text_list" : [input] }
    const url     = 'https://' + domain +
                    '/v2/classifiers/' + classifier +
                    '/classify/';

    // Get Data
    return new Promise( ( resolve, reject ) => {
        xhr.fetch( url, {
            method  : 'POST'
        ,   body    : data
        ,   headers : { 'Authorization' : libauth }
        } ).then( response => {
            resolve(JSON.parse(response.body).result[0][0]);
        } ).catch( err => {
            //console.log( 'Error:', err );
        } );
    } );

};


