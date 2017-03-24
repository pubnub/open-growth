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
        //add BCCs
        request.bcc=[
            {"address": opengrowth.keys.salesforce.bcc},
            {"address": opengrowth.keys.pubnub.bcc}
        ];
    }
    else {
        //add BCCs
        request.bcc.push({"address": opengrowth.keys.salesforce.bcc});
        request.bcc.push({"address": opengrowth.keys.pubnub.bcc});
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
        if ( res.status < 200 || res.status > 299 ) {
            console.log("SendWithUs Error:\n" + res);
            opengrowth.log("sendwithus.email", "xhr", res, true);
        }
        else {
            //console.log( "SendWithUs Response:\n" + JSON.stringify(res));
            opengrowth.log("sendwithus.email", "xhr", res.status);
        }
    })
    .catch( err => {
        console.log("SendWithUs Error:\n" + err);
        opengrowth.log("sendwithus.email", "xhr", err, true);
    } );
};
