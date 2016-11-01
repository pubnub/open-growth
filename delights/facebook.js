// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Post on Customer's Wall on Facebook
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.facebook = {};
opengrowth.delight.facebook.post = ( signal, email, handle, message ) => {
    // Record Delight Activity
    opengrowth.track.delight( 'facebook.post', signal, {
        email   : email
    ,   handle  : handle
    ,   message : message
    } );
    // ⚠️  opengrowth.keys.facebook.keys
    // TODO FB Post
};
