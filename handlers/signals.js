// Open Growth Signals Handler
export default request => {
    const message = request.message;
    const signal  = message.signal;
    const email   = message.email;

    // TODO de-duplicate (prevent duplicate signals from activiating)
    // TODO track signal analytics with total/yr/mm/day/hour
    // TODO librato
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

// Send Emails with Pardot
opengrowth.delight.pardot.email = ( signal, message, email, subject ) => {
    opengrowth.track( signal, message, email );
    // ⚠️  opengrowth.keys.sendgrid.apikey
    // TODO send email with pardot/sendgrid
};

// Send Emails with SendGrid
opengrowth.delight.sendgrid.email = ( signal, message, email, subject ) => {
    opengrowth.track( signal, message, email );
    // ⚠️  opengrowth.keys.sendgrid.apikey
    // TODO send email with pardot/sendgrid
};

// Send SMS with RingCentral
opengrowth.delight.ringcentral.sms = ( signal, message, phone ) => {
    opengrowth.track( signal, message, phone );
    // ⚠️  opengrowth.keys.ringcentral.apikey
    // TODO send SMS on RingCentral
};

// Send SMS with Twilio
opengrowth.delight.twilio.sms = ( signal, message, phone ) => {
    opengrowth.track( signal, message, phone );
    // ⚠️  opengrowth.keys.twilio.apikey
    // TODO send SMS on Twilio
};

// Tweet at Customer
opengrowth.delight.twitter.tweet = ( signal, message ) => {
    opengrowth.track( signal, message );
    // ⚠️  opengrowth.keys.twitter.keys
    // TODO Tweet on Twitter
};

// Send Snap to User
opengrowth.delight.snapchat.snap = ( signal, message, userid ) => {
    opengrowth.track( signal, message, userid );
    // ⚠️  opengrowth.keys.snapchat.a-thing...
    // TODO Send a Snap 
};

// Post to Customer on LinkedIn
opengrowth.delight.linkedin.post = ( signal, message ) => {
    opengrowth.track( signal, message );
    // ⚠️  opengrowth.keys.linkedin.keys
    // TODO Post on LinkedIn
};

// Post on Customer's Wall on Facebook
opengrowth.delight.facebook.post = ( signal, message ) => {
    opengrowth.track( signal, message );
    // ⚠️  opengrowth.keys.facebook.keys
    // TODO FB Post
};
