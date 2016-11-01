// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Send SMS with RingCentral
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.ringcentral = {};
opengrowth.delight.ringcentral.sms = ( signal, email, phone, message ) => {
    // Record Delight Activity
    opengrowth.track.delight( 'ringcentral.sms', signal, {
        email   : email
    ,   phone   : phone
    ,   message : message
    } );
    // ⚠️  opengrowth.keys.ringcentral.apikey
    // TODO send SMS on RingCentral
};

