// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Send Snap to User
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.snapchat = {};
opengrowth.delight.snapchat.snap = ( signal, email, userid, message ) => {
    // Record Delight Activity
    opengrowth.track.delight( 'snapchat.snap', signal, {
        email   : email
    ,   userid  : userid
    ,   message : message
    } );
    // ⚠️  opengrowth.keys.snapchat.a-thing...
    // TODO Send a Snap 
};

