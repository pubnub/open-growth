// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Customer Fetch
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.customer = {};
opengrowth.customer.getCustomer = ( email, signal ) => {

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
        opengrowth.modules.clearbit.lookup(email).then( res => {
            let customerLog = getCustomerLog(res.customer);
            opengrowth.log("clearbit", "module", customerLog);
            monkeyLearn( res.customer, resolve, reject );
        }).catch( err => {
            opengrowth.log("clearbit", "module", err, true);
            monkeyLearn( {}, resolve, reject );
        });

        var monkeyLearn = ( customer, resolve, reject ) => {
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
                opengrowth.log("monkeylearn", "module", usecase);
                resolve(customer);
            } ).catch((err) => {
              opengrowth.log("monkeylearn", "module", err, true);
          });
        };
    } );

};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Get first name from a Customer Object, returns null if not found
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.customer.getFirstName = ( customer ) => {
	let result = null;
    if ( customer && customer.person && customer.person.name &&
         customer.person.name.givenName &&
         customer.person.name.givenName !== 'Not Found' &&
         customer.person.name.givenName !== 'null' ) {
      result = customer.person.name.givenName;
    }
    return result;
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Get last name from a Customer Object, returns null if not found
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.customer.getLastName = ( customer ) => {
	let result = null;
    if ( customer && customer.person && customer.person.name &&
         customer.person.name.familyName &&
         customer.person.name.familyName !== 'Not Found' &&
         customer.person.name.familyName !== 'null' ) {
      result = customer.person.name.familyName;
    }
    return result;
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Get company name from a Customer Object, returns null if not found
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.customer.getCompany = ( customer ) => {
    let result = null;
    if ( customer && customer.company &&
         customer.company.name &&
         customer.company.name !== 'Not Found' &&
         customer.company.name !== 'null' ) {
      result = customer.company.name;
    }
    return result;
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Parses ClearBit data that Open Growth uses to an object and logs it
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
let getCustomerLog = ( customer ) => {
    let log = {};

    if ( customer && customer.email ) log.email = customer.email;

    if ( customer && customer.person && customer.person.name ) {
        log.name = customer.person.name;
    }

    if ( customer && customer.company && customer.company.name ) {
        log.company = customer.company.name;
    }

    if ( customer && customer.company && customer.company.description ) {
        log.company_description = customer.company.description;
    }

    return log;
};
