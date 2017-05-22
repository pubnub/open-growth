// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Send Emails with SendGrid
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.sendgrid = {};
opengrowth.delight.sendgrid.email = ( request ) => {
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
            "to"  : [ { "email" : request.email, "name" : request.name } ],
            "bcc" : request.bccs,
        ,   "substitutions" : request.substitutions
        } ]
    };
    
    if ( !request.bccs || !request.bccs.length ) {
        delete data.personalizations[0].bcc;
    }

    //add content if not using a template on sendgrid
    if ( request.message ) {
        data.subject = request.subject;
        data.content = [ { "type" : "text/html", "value" : request.message } ];
        delete data.personalizations[0].substitutions;
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

    // Record Delight Activity
    opengrowth.track.delight( 'sendgrid.email', request.signal, {
      "email"    : request.email
    , "subject"  : request.subject
    , "message"  : request.message || "SG Template"
    , "bccs"     : request.bccs
    , "category" : request.categories[0]
    } );

    let errorHandler = ( err ) => {
        console.log("SendGrid Error:\n", err);
        let error = err ? err.body || err.statusText || err.status : null;
        opengrowth.log("sendgrid.email", "xhr", error, true);
    };

    // post email
    return xhr.fetch( apiurl, sendgridRequest )
    .then( ( res ) => {
        if ( res.status >= 200 && res.status < 300 ) {
            //console.log( "SendGrid Response:\n" + JSON.stringify(res));
            opengrowth.log("sendgrid.email", "xhr", res.status);
        }
        else {
            errorHandler(res);
        }
    })
    .catch(errorHandler);
};