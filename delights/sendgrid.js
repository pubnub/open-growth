// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Send Emails with SendGrid
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.sendgrid = {};
opengrowth.delight.sendgrid.email = (
    signal, message, email, name, subject, bccs
) => {

    // Record Delight Activity
    opengrowth.track.delight( 'sendgrid.email', signal, {
        email   : email
    ,   subject : subject
    ,   message : message
    ,   bccs    : bccs
    } );
    
    // sendgrid api url
    const apiurl = 'https://api.sendgrid.com/v3/mail/send';

    // sendrid api user
    const apiuser = opengrowth.keys.sendgrid.user;

    // sendgrid api key
    const apikey = opengrowth.keys.sendgrid.apikey;

    // sendgrid reply to
    const replyto      = opengrowth.keys.sendgrid.replyto;
    const replyto_name = opengrowth.keys.sendgrid.replyto_name;

    // sendgrid sender email address
    const sender      = opengrowth.keys.sendgrid.sender;
    const sender_name = opengrowth.keys.sendgrid.sender_name;

    // payload
    const data = {
        from              : { email: sender,  name: sender_name  }
    ,   reply_to          : { email: replyto, name: replyto_name }
    ,   tracking_settings : { subscription_tracking : { enable : false } }
    ,   content           : [ { type : "text/html", value : message } ]
    ,   personalizations  : [ {
            to      : [ { email : email, name : name } ]
        ,   subject : subject
        ,   bccs    : bccs
        } ]
    };

    // post email
    return xhr.fetch( apiurl, {
        method  : 'POST'
    ,   body    : data
    ,   headers : {
        'Authorization' : `Bearer ${apikey}`
    ,   'Content-Type'  : 'application/json'
    }
    } ).catch( err => {
        //console.log( 'Error:', err );
    } );

};
