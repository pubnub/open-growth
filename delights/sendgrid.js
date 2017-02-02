// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Send Emails with SendGrid
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.sendgrid = {};
opengrowth.delight.sendgrid.email = ( req ) => {

    // Record Delight Activity
    opengrowth.track.delight( 'sendgrid.email', req.signal, {
      "email"    : req.email
    , "subject"  : req.subject
    , "message"  : req.message || "SG Template"
    , "bccs"     : req.bccs
    , "category" : req.categories[0]
    } );
    
    // sendgrid api url
    const apiurl = "https://api.sendgrid.com/v3/mail/send";

    // sendrid api user
    const apiuser = opengrowth.keys.sendgrid.user;

    // sendgrid api key
    const apikey = opengrowth.keys.sendgrid.apikey;

    // payload
    let data = {
      "from"              : { "email": req.sender_email,  "name": req.sender_name  }
    , "reply_to"          : { "email": req.reply_email, "name": req.reply_name }
    , "tracking_settings" : { "subscription_tracking" : { "enable" : false } }
    , "categories"        : req.categories
    , "template_id"       : req.template_id
    , "personalizations"  : [ {
            "to" : [ { "email" : req.email, "name" : req.name } ]
        ,   "subject" : req.subject
        ,   "substitutions" : req.substitutions
        } ]
    };

    //add BCCs for SalesForce
    if ( req.bccs.length !== 0 ) {
        data.personalizations[0].bcc = req.bccs;
        data.personalizations[0].bcc.push({
            "email": "open-growth-activity@pubnub.com"
        });
    } else {
        data.personalizations[0].bcc = [{
            "email": "open-growth-activity@pubnub.com"
        }];
    }

    //add content if not using a template on sendgrid
    if ( req.message ) {
        data.content = [ { "type" : "text/html", "value" : req.message } ];
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
