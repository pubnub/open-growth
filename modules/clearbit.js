// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Lookup Customers with Clearbit
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.modules.clearbit = {};
opengrowth.modules.clearbit.lookup = (email) => {

    // Skip if missing API Keys
    if (!opengrowth.keys.clearbit.apikey) return (new Promise()).resolve({
        email   : email
    ,   message : 'Clearbit disabled. No API Key.'
    });

    // B64 Encode Auth Header
    const libauth = auth.basic( opengrowth.keys.clearbit.apikey, '' );
    const domain  = 'person.clearbit.com';
    const url     = 'https://'+ domain +'/v2/combined/find?email=' + email;

    // Get Customer Bio
    return new Promise( ( resolve, reject ) => {
        xhr.fetch( url, {
            method  : 'GET'
        ,   headers : { 'Authorization' : libauth }
        } ).then( response => {
            resolve(JSON.parse(response.body));
        } ).catch( err => {
            //console.log( 'Error:', err );
        } );
    } );

};

