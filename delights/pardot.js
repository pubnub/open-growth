// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Send Emails with Pardot
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.pardot = {};
opengrowth.delight.pardot.email = ( signal, email, subject, message ) => {
    // Record Delight Activity
    opengrowth.track.delight( 'pardot.email', signal, {
        email   : email
    ,   subject : subject
    ,   message : message
    } );
    // ⚠️  opengrowth.keys.sendgrid.apikey
    // TODO send email with pardot/sendgrid
};

