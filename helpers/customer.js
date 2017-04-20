// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Customer Data Enrichment Functions
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.customer = {};
opengrowth.customer.getDataFromClearbit = ( email ) => {
  return new Promise ( ( resolve, reject ) => {
    opengrowth.modules.clearbit.lookup(email)
    .then( res => {
        resolve(res.customer || {});
    })
    .catch( err => {
        resolve({});
    });
  });
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Overwrites Signup Data with ClearBit Data
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.customer.enrich = ( customerData, clearbitData ) => {
  return new Promise( ( resolve, reject ) => {
    let firstName   = opengrowth.customer.getFirstName(clearbitData);
    let lastName    = opengrowth.customer.getLastName(clearbitData);
    let company     = opengrowth.customer.getCompany(clearbitData);
    let description = opengrowth.customer.getDescription(clearbitData);

    let customer = {
      "email"       : customerData.email,
      "firstName"   : firstName   || customerData.firstName,
      "lastName"    : lastName    || customerData.lastName,
      "phone"       : customerData.phone,
      "company"     : company     || customerData.company,
      "description" : description || customerData.description,
      "usecase"     : customerData.usecase
    };
    
    resolve(customer);
  });
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Provides a Use Case from MonkeyLearn based on a company description
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.customer.getUseCase = ( customer ) => {
  return new Promise( ( resolve, reject ) => {

    if ( !customer.description ) {
      resolve(null);
    } else {
      opengrowth.modules.monkeylearn.classify(
        customer.description,
        opengrowth.keys.monkeylearn.usecase_classifier
      ).then( usecase => resolve(usecase) )
      .catch( err     => resolve(null) );
    }

  });
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
// Get company description from a Customer Object, returns null if not found
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.customer.getDescription = ( customer ) => {
    let result = null;
    if ( customer && customer.company &&
         customer.company.description &&
         customer.company.description !== 'Not Found' &&
         customer.company.description !== 'null' ) {
      result = customer.company.description;
    }
    return result;
};
