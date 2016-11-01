// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Request Postmates Order
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.postmates = {};
opengrowth.delight.postmates.order = ( signal, email, address, order ) => {
    // Record Delight Activity
    opengrowth.track.delight( 'postmates.order', signal, {
        email : email
    } );
    // ⚠️  opengrowth.keys.postmates.a-thing...
    // TODO Send a Cake
};

