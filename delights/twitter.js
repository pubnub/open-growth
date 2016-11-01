// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Tweet at Customer
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.twitter = {};
opengrowth.delight.twitter.tweet = ( signal, email, handle, message ) => {
    // Record Delight Activity
    opengrowth.track.delight( 'twitter.tweet', signal, {
        email   : email
    ,   handle  : handle
    ,   message : message
    } );
    // ⚠️  opengrowth.keys.twitter.keys
    // TODO Tweet on Twitter
};

