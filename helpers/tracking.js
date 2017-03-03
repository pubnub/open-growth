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
    var counter = `opengrowth.${key}.${y}_${m}_${d}_${h}_${min}`;
    return kvdb.incrCounter( counter, 1 ).then( () => {
        return kvdb.getCounter(counter);
    } ).then( (value) => {
        // Record Resolutions
        //kvdb.incrCounter( `opengrowth.${key}.${y}_${m}`,           1 );
        //kvdb.incrCounter( `opengrowth.${key}.${y}_${m}_${d}`,      1 );
        //kvdb.incrCounter( `opengrowth.${key}.${y}_${m}_${d}_${h}`, 1 );

        // Librato
        return opengrowth.modules.librato( `opengrowth.${key}`, value );
    } );
};


// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Track Signals Received
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.track.signal = ( signal, data ) => {
    return track(`signals.${signal}`);
    //.then( (result) => {
        //console.log( 'Libratted:', result );
    //} );
    // TODO
    // TODO log signal to MySQL / segmentIO
    // TODO 
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Track Delights Sent
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.track.delight = ( delight, signal, data ) => {
    return track(`delights.${delight}`);
    // TODO
    // TODO log delight to MySQL
    // TODO 
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Track Reactions
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.track.reaction = (what_goes_here) => {
    return track(`reactions`);
    // TODO
    // TODO log reaction to MySQL
    // TODO 
};
