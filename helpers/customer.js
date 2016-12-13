// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Customer Fetch
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.customer = ( email, signal ) => {

    // TODO 
    // TODO Augment/Extend 'SYNC' User Profile KV Entry
    // TODO with all new keys supplied in the signal data
    // TODO so we have a progressively built profile.
    // TODO 

    // TODO check kv store
    // TODO check kv store and MERGE
    // TODO check kv store
    const usecase_classifier = 'cl_Lyv9HzfF';
    return new Promise( ( resolve, reject ) => {
        opengrowth.modules.clearbit.lookup(email).then( customer => {
            monkeyLearn( customer, resolve, reject )
        }).catch( error => {
            monkeyLearn( {}, resolve, reject )
        });

        monkeyLearn = ( customer, resolve, reject ) => {
            // keep track of details
            customer.email  = email;
            customer.signal = signal;

            const description = (customer.company||{}).description;
            if (!description) return resolve(customer);

            opengrowth.modules.monkeylearn.classify(
                description,
                usecase_classifier
            ).then( usecase => {
                customer.email   = email;
                customer.usecase = usecase;
                resolve(customer);
            } );
        }
    } );

};
