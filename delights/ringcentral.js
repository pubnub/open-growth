// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Send SMS with RingCentral
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.ringcentral = {};
opengrowth.delight.ringcentral.sms = (request, email, recipientName, recipientLocation) => {
    // Record Delight Activity
    opengrowth.track.delight('ringcentral.sms', request.message.signal, {
        email: email,
        phone: request.message.recipientPhone,
        message: request.message.text
    });
    const appKey = opengrowth.keys.ringcentral.appkey;
    const appSecret = opengrowth.keys.ringcentral.secret;

    const senderPhone = opengrowth.keys.ringcentral.senderPhone;
    const senderPassword = opengrowth.keys.ringcentral.password;

    const recipientPhone = request.message.recipientPhone;

    // Following config is for ringcentral API. You need to use your own
    // config
    const blockConfig = {
        appsecret: appSecret,
        appkey: appKey,
        path: '/restapi/v1.0/account/~n/extension/~e/sms',
        oauth_url: '/restapi/oauth/token',
        host: 'platform.devtest.ringcentral.com',
        appcred: auth.basic(appKey, appSecret)
    };

    const smsConfig = {
        rc: {
            username: senderPhone,
            password: senderPassword,
            extension: '101',
            access_token: '',
            refresh_token: '',
            isRingCentral: 1
        }
    };

    sendSms(recipientPhone, request.message.text, "response-channel");

    function authToRingCentral(callback) {
        if ((smsConfig.rc !== null) && (!smsConfig.rc.access_token)) {
            let httpOptions = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: blockConfig.appcred
                },
                body: query.stringify({
                    grant_type: 'password',
                    username: smsConfig.rc.username,
                    extension: smsConfig.rc.extension,
                    password: smsConfig.rc.password
                })
            };

            httpOptions.method = 'post';

            xhr.fetch('https://' + blockConfig.host + blockConfig.oauth_url, httpOptions)
                .then(r => {
                        let raccessTok = JSON.parse(r.body || r);
                        smsConfig.access_token = raccessTok.access_token;
                        if (callback) callback();
                    },
                    e => console.error(e)
                )
                .catch(e => console.error(e));
        }
    }

    function sendSms(toPhone, message, responseChannel) {
        authToRingCentral(() => {
            const bearerToken = 'Bearer ' + smsConfig.access_token;

            const payload = JSON.stringify({
                from: {
                    phoneNumber: smsConfig.rc.username
                },
                to: [{
                    phoneNumber: toPhone,
                    name: recipientName || "None",
                    location: recipientLocation || "None"
                }],
                text: message
            });

            const httpOptions = {
                as: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: bearerToken
                },
                body: payload,
                method: 'post'
            };

            const path = 'https://' + blockConfig.host + '/restapi/v1.0/account/~/extension/~/sms';

            return xhr.fetch(path, httpOptions)
                .then(
                    () => {
                        pubnub.publish({
                            channel: responseChannel,
                            message: 1
                        });
                        return request.ok();
                    },
                    response => {
                        pubnub.publish({
                            channel: responseChannel,
                            message: 0
                        });
                        console.error(
                            'sms failed, this is not going to execute');
                        if (response) console.error(response);
                        return request.ok();
                    }
                )
                .catch(e => {
                    console.error(e);
                    pubnub.publish({
                        channel: responseChannel,
                        message: 0
                    });
                });
        });
    }

    return request.ok();
};