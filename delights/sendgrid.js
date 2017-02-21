// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Send Emails with SendGrid
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.sendgrid = {};
opengrowth.delight.sendgrid.email = ( request ) => {
    // Record Delight Activity
    opengrowth.track.delight( 'sendgrid.email', request.signal, {
      "email"    : request.email
    , "subject"  : request.subject
    , "message"  : request.message || "SG Template"
    , "bccs"     : request.bccs
    , "category" : request.categories[0]
    } );
    
    // sendgrid api url
    const apiurl = "https://api.sendgrid.com/v3/mail/send";

    // sendrid api user
    const apiuser = opengrowth.keys.sendgrid.user;

    // sendgrid api key
    const apikey = opengrowth.keys.sendgrid.apikey;

    // payload
    let data = {
      "from"              : { "email": request.sender_email,  "name": request.sender_name  }
    , "reply_to"          : { "email": request.reply_email, "name": request.reply_name }
    , "tracking_settings" : { "subscription_tracking" : { "enable" : false } }
    , "categories"        : request.categories
    , "template_id"       : request.template_id
    , "personalizations"  : [ {
            "to" : [ { "email" : request.email, "name" : request.name } ]
        ,   "substitutions" : request.substitutions
        } ]
    };

    //add BCCs for SalesForce
    if ( request.bccs && request.bccs.length && request.bccs.length !== 0 ) {
        data.personalizations[0].bcc = request.bccs;
    } else {
        data.personalizations[0].bcc = [{
            "email": "open-growth-activity@pubnub.com"
        }];
    }

    //add content if not using a template on sendgrid
    if ( request.message ) {
        data.content = [ { "type" : "text/html", "value" : request.message } ];
        delete data.personalizations.substitutions;
        delete data.template_id;
    }

    let sendgridRequest = {
          "method"  : "POST"
        , "body"    : data
        , "headers" : {
          "Authorization" : `Bearer ${apikey}`
        , "Content-Type"  : "application/json"
        }
    }

    // post email
    return xhr.fetch( apiurl, sendgridRequest ).then( (res) => {
        console.log( 'SendGrid Response: ' + JSON.stringify(res));
    })
    .catch( err => {
        console.log( "SendGrid Error:\n" + err );
    } );
};