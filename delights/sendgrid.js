// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Send Emails with SendGrid
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.sendgrid = {};
opengrowth.delight.sendgrid.email = (
    signal, message, email, name, sender_email, sender_name, reply_email, reply_name, subject, bccs, categories
) => {

    // Record Delight Activity
    opengrowth.track.delight( 'sendgrid.email', signal, {
        email    : email
    ,   subject  : subject
    ,   message  : message
    ,   bccs     : bccs
    ,   category : categories[0]
    } );
    
    // sendgrid api url
    const apiurl = 'https://api.sendgrid.com/v3/mail/send';

    // sendrid api user
    const apiuser = opengrowth.keys.sendgrid.user;

    // sendgrid api key
    const apikey = opengrowth.keys.sendgrid.apikey;

    // payload
    const data = {
        mail_settings     : { bcc: { enable: true, email: "open-growth-activity@pubnub.com" } }
    ,   from              : { email: sender_email,  name: sender_name  }
    ,   reply_to          : { email: reply_email, name: reply_name }
    ,   tracking_settings : { subscription_tracking : { enable : false } }
    ,   categories        : categories
    ,   content           : [ { type : "text/html", value : message } ]
    ,   personalizations  : [ {
            to      : [ { email : email, name : name } ]
        ,   subject : subject
        } ]
    };

    if ( bccs.length !== 0 ) {
        data.personalizations[0].bcc = bccs;
    }

    // post email
    return xhr.fetch( apiurl, {
        method  : 'POST'
    ,   body    : data
    ,   headers : {
        'Authorization' : `Bearer ${apikey}`
    ,   'Content-Type'  : 'application/json'
    }
    } ).then( (res) => {
        //console.log( 'SendGrid Response: ' + JSON.stringify(res));
    })
    .catch( err => {
        console.log( 'SendGrid Error:\n' + JSON.stringify(err) );
    } );

};
