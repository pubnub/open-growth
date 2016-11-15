// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Send Emails with SendGrid
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.sendgrid = {};
opengrowth.delight.sendgrid.email = ( signal, message, email, subject ) => {

    // Record Delight Activity
    opengrowth.track.delight( 'sendgrid.email', signal, {
        email   : email
    ,   subject : subject
    ,   message : message
    } );
    
    // sendgrid api url
    var apiUrl = 'https://api.sendgrid.com/api/mail.send.json';

    // sendrid api user
    var apiUser = opengrowth.keys.sendgrid.user;

    // sendgrid api key
    var apiKey = opengrowth.keys.sendgrid.appkey;

    // sendgrid sender email address
    var sender = opengrowth.keys.sendgrid.sender;

    return xhr.fetch(apiUrl + '?' + query.stringify({
        api_user : apiUser
    ,   api_key  : apiKey
    ,   from     : sender
    ,   to       : email
    ,   toname   : name
    ,   subject  : subject
    ,   text     : message
    })).catch( (info) => {
        // console.log( 'Sendgrid Failed', info );
    });

};
