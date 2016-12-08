opengrowth.signals.day3 = ( request, customer ) => {
    kvdb.get('day3-'+request.message.email).then(duplicate => {
        if(!duplicate){
            kvdb.set('day3-'+request.message.email, true);
            const name = '';

            const message = 'this gets sent to everyone that signed up 3 days ago';

            // Debug show Message
            console.log(message);

            // Send Email
            //const email   = request.message.email;
            //const email   = 'blum.stephen@gmail.com';
            const email   = 'open-growth-activity@pubnub.com';
            const subject = 'day3';
            opengrowth.delight.sendgrid.email(
                'day3', message, email, name, subject
            );
        } else {
            console.log('deduplicated');
        }
    });
};
