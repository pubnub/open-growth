// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Send SMS with Twilio
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.twilio = {};
opengrowth.delight.twilio.sms = ( signal, email, phone, message ) => {
    // Record Delight Activity
    opengrowth.track.delight( 'twilio.sms', signal, {
        email   : email
    ,   phone   : phone
    ,   message : message
    } );
    // ⚠️  opengrowth.keys.twilio.apikey
    // TODO send SMS on Twilio
};

