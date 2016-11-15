opengrowth.signals.signup = ( request, customer ) => {
    // Name
    var name = '';
    try       { name = customer.person.name.fullName }
    catch (e) { name = '' }

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

    // Usecase
    var usecase = '';
    try       { usecase = customer.usecase.label }
    catch (e) { usecase = '' }

    const message =
    `Email generated for ${JSON.stringify(request.message)} \r\n\r\n` +
    `Hi ${name || 'there'}! ` +
    `I am PubNubBot, an Artificial Intelligence alive in PubNub BLOCKS. ` +
    `${usecase ? 'I can answer your realtime ' + usecase + ' questions.' : ''} ` +
    `${city    ? 'I see you are in '  + city    + '.' : ''} ` +
    `${company ? 'You work at '       + company + '.' : ''} ` +
    `${title   ? 'You are the '       + title   + '.' : ''} ` +
    `${city == 'San Francsico' ? 'You should visit us some time! ':''}` +
    `I will send you helpful tips at times. `;

    // Send Email
    //const email   = request.message.email;
    //const email   = 'blum.stephen@gmail.com';
    const email   = 'open-growth-activity@pubnub.com';
    const subject = `Hi ${name || 'there'}!`;
    opengrowth.delight.sendgrid.email(
        'signup', message, email, name, subject
    );

    // Signal Complete
    return request.ok({
        signup   : true
    ,   email    : request.message.email
    ,   message  : message
    //,   customer : customer
    //,   reqmsg   : request.message
    });
};
