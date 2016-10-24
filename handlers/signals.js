// Open Growth Signals Handler
export default request => {
    const message = request.message;
    const signal  = message.signal;
    const email   = message.email;

    // TODO de-duplicate (prevent duplicate signals from activiating)
    // TODO track signal analytics with total/yr/mm/day/hour
    // TODO special track signal "reaction" for extra metrics
    // TODO track sent delights
    // TODO send to SQL DB

    // TODO Augment/Extend "SYNC" User Profile KV Entry
    //      with all new keys supplied in the signal data
    //      so we have a progressively built profile.

    // TODO Get Clearbit/MonkeyLearn
    // TODO from KV or build from scratch.
    opengrowth.customer(email).then( customer => {
        opengrowth.signals["*"]( signal, customer );
        opengrowth.signals[signal](customer);
    } );

    // Instant Passthrough
    return request.ok();
}

// Open Growth Framework
const opengrowth = () => {};

// Signals
opengrowth.signals = {};
opengrowth.on      = ( signal, callback ) => {
    opengrowth.signals[signal] = callback;
}

// Customer Fetch
opengrowth.customer = (email) => {
    // check kv store
    // if not cached, build with Clearbit and MonkeyLearn
    // return promise
};

// Analytical Tracking of Delights
opengrowth.track = ( signal, message, handle ) => {
    // TODO
    // increment KV for `delight.${signal}`.
};

// Vendors
opengrowth.delight = {};

// Send Emails
opengrowth.delight.email = ( signal, message, email, subject ) => {
    opengrowth.track( signal, message, email );
    // ⚠️  opengrowth.keys.sendgrid.apikey
    // TODO send email with pardot/sendgrid
};

// Send SMS
opengrowth.delight.sms = ( signal, message, phone ) => {
    opengrowth.track( signal, message, phone );
    // ⚠️  opengrowth.keys.twilio.apikey
    // TODO send SMS on Twilio/or other
};

// Tweet at Customer
opengrowth.delight.tweet = ( signal, message, handle ) => {
    opengrowth.track( signal, message, handle );
    // ⚠️  opengrowth.keys.twitter.keys
    // TODO Tweet on Twitter
};

// Post to Customer on LinkedIn
opengrowth.delight.linkedin = ( signal, message, handle ) => {
    opengrowth.track( signal, message, handle );
    // ⚠️  opengrowth.keys.linkedin.keys
    // TODO Post on LinkedIn
};

// Post on Customer's Wall on Facebook
opengrowth.delight.facebook = ( signal, message, handle ) => {
    opengrowth.track( signal, message, handle );
    // ⚠️  opengrowth.keys.facebook.keys
    // TODO FB Post
};
