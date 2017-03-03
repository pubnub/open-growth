// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Send Emails with SendWithUs
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.sendwithus = {};
opengrowth.delight.sendwithus.email = ( request ) => {
    // Record Delight Activity
    opengrowth.track.delight( 'sendwithus.email', request.signal, {
      "email"    : request.recipient.address
    , "message"  : request.message || "SWU Template"
    , "bccs"     : request.bcc
    , "category" : request.tags[0] || "none"
    } );
    
    // swu api url
    const apiurl = "https://api.sendwithus.com/api/v1/send";

    // swu api key
    const apikey = opengrowth.keys.swu.apikey;

    //add sendgrid key to request
    request["esp_account"] = opengrowth.keys.swu.espkey

    //add BCCs for SalesForce
    if ( !request.bcc || !request.bcc.length ) {
        request.bcc = [{
            "address": "open-growth-activity@pubnub.com"
        }];
    }
    else {
        // TODO:
        // Remove this and have generators send
        // "address" instead of "email"
        for ( let i of request.bcc ) {
            i['address'] = i['email'];
            delete i['email'];
        }
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
    
    // post email
    return xhr.fetch( apiurl, swuRequest ).then( (res) => {
        //console.log( "SendWithUs Response: " + JSON.stringify(res));
    })
    .catch( err => {
        console.log( "SendWithUs Error:\n" + err );
    } );
};
