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
    request["esp_account"] = opengrowth.keys.swu.espkey

    //add BCCs for SalesForce and activity email list
    if ( !request.bcc || !request.bcc.length ) {
        request.bcc = [];
    }

    //add BCCs
    request.bcc = request.bcc.concat([
        { "address": opengrowth.keys.salesforce.bcc },
        { "address": opengrowth.keys.pubnub.bcc }
    ]);

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

    // post email
    return xhr.fetch( apiurl, swuRequest ).then( (res) => {
        if ( res.status >= 200 && res.status < 300 ) {
            //console.log( "SendWithUs Response:\n" + JSON.stringify(res));
            opengrowth.log("sendwithus.email", "xhr", res.status);
        }
        else {
            console.log("SendWithUs Error:\n" + res);
            opengrowth.log("sendwithus.email", "xhr", res, true);
        }
    })
    .catch( err => {
        console.log("SendWithUs Error:\n" + err);
        opengrowth.log("sendwithus.email", "xhr", err, true);
    } );
};
