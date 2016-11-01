// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Post to Customer on LinkedIn
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.linkedin = {};
opengrowth.delight.linkedin.post = ( signal, email, handle, message ) => {
    // Record Delight Activity
    opengrowth.track.delight( 'linkedin.post', signal, {
        email   : email
    ,   handle  : handle
    ,   message : message
    } );
    // ⚠️  opengrowth.keys.linkedin.keys
    // TODO Post on LinkedIn
};
