opengrowth.signals.signup = ( request, customer ) => {
    // Name
    var name = '';
    try       { name = customer.person.name.fullName }
    catch (e) { name = 'there' }

    // Photo
    var photo = '';
    try       { photo = customer.person.avatar }
    catch (e) { photo = '' }

    // City
    var city = '';
    try       { city = customer.person.geo.city }
    catch (e) { city = '' }

    // Company
    var company = '';
    try       { company = customer.person.employment.name }
    catch (e) { company = '' }

    // Title
    var title = '';
    try       { title = customer.person.employment.title }
    catch (e) { title = '' }

    const message = `
        Hi ${name}!
        I am Pubbot, an Artificial Intelligence alive in PubNub BLOCKS.
        ${city    && 'I see you are in ' + city + '.'}
        ${company && 'You work at '  + company + '.'}
        ${title   && 'You are ' + title + '.'}
        You should visit us some time!
        I will send you helpful tips.
        <br><img src='${photo}'>
    `;

    const email   = 'open.growth.activity@pubnub.com';
    const subject = 'PubNub';
    opengrowth.delight.sendgrid.email = ( 'signup', message, email, subject );
    return request.ok({
        signup   : true
    //,   customer : customer
    //,   reqmsg   : request.message
    ,   message  : message
    });
};
