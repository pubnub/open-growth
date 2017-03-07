// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Analytical Tracking of Delights
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.track = {};
const track = (key) => {
    // Counter Key
    const time = new Date();
    const y    = time.getFullYear();
    const m    = time.getMonth();
    const d    = time.getDate();
    const h    = time.getHours();
    const min  = time.getMinutes();

    // Increment KV Counters
    let count = opengrowth.libratoUpdates[`opengrowth.${key}`];
    opengrowth.libratoUpdates[`opengrowth.${key}`] = count ? count+1 : 1;
};


// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Track Signals Received
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.track.signal = ( signal, data ) => {
    opengrowth.log(signal, "signal", data);
    return track(`signals.${signal}`);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Track Delights Sent
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.track.delight = ( delight, signal, data ) => {
    opengrowth.log(delight, "delight", data);
    return track(`delights.${delight}`);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Track Reactions
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.track.reaction = (what_goes_here) => {
    return track(`reactions`);
};
