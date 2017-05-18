// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Send Emails with SendWithUs
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.sendwithus = {};
opengrowth.delight.sendwithus.email = ( request ) => {
    // swu api url
    const apiurl = "https://api.sendwithus.com/api/v1/send";

    // swu api key
    const apikey = opengrowth.keys.swu.apikey;

    //add sendgrid key to request
    request["esp_account"] = opengrowth.keys.swu.espkey;

    if ( !request.bcc || !request.bcc.length ) {
        delete request.bcc;
    }

    // B64 Encode Auth Header for Basic Auth
    const libauth = auth.basic( apikey, '' );

    let swuRequest = {
          "method"  : "POST"
        , "body"    : request
        , "headers" : {
          "Authorization" : libauth
        , "Content-Type"  : "application/json"
        }
    }

    // Record Delight Activity
    opengrowth.track.delight( 'sendwithus.email', request.signal, {
      "email"    : request.recipient.address
    , "message"  : request.message || "SWU Template"
    , "bccs"     : request.bcc
    , "category" : request.tags[0] || "none"
    } );

    let errorHandler = ( err ) => {
        console.log("SendWithUs Error:\n", err);
        let error = err ? err.body || err.statusText || err.status : null;
        opengrowth.log("sendwithus.email", "xhr", error, true);
    };

    // post email
    return xhr.fetch( apiurl, swuRequest ).then( (res) => {
        if ( res.status >= 200 && res.status < 300 ) {
            // console.log( "SendWithUs Response:\n" + JSON.stringify(res));
            opengrowth.log("sendwithus.email", "xhr", res.status);
        }
        else {
            errorHandler(res);
        }
    })
    .catch(errorHandler);
};
