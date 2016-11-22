// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Send Emails with SendGrid
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

opengrowth.delight.sendgrid = {};

opengrowth.delight.sendgrid.email = (request, email, subject) => {
    // Record Delight Activity
    opengrowth.track.delight('sendgrid.email', request.message.signal, {
        email: email,
        subject: subject,
        message: request.message.text
    });

    // sendgrid api url
    var apiUrl = 'https://api.sendgrid.com/api/mail.send.json';

    // sendrid api user
    var apiUser = opengrowth.keys.sendgrid.user;

    // sendgrid api key
    var apiKey = opengrowth.keys.sendgrid.appkey;

    // sendgrid sender email address
    var senderAddress = opengrowth.keys.sendgrid.sender;

    try {

        // create a HTTP GET request to the sendgrid API
        return xhr.fetch(apiUrl + '?' + query.stringify({
            api_user: apiUser, // your sendgrid api username
            api_key: apiKey, // your sendgrid api password
            from: senderAddress, // sender email address
            to: request.message.to, // recipient email address
            toname: request.message.toname, // recipient name
            subject: request.message.subject, // email subject
            text: request.message.text // email text
        })).then(function(res) {
            return request;
        });

    } catch (e) {
        return request;
    }
};
