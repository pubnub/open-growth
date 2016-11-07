// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Tweet at Customer
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.delight.twitter = {};
opengrowth.delight.twitter.tweet = (request, email) => {
    opengrowth.track.delight('twitter.tweet', request.message.signal, {
        email   : email
    ,   message : request.message.message
    });
    return submitRequest(request);
};
opengrowth.delight.twitter.deleteTweet = (request, email) => {
    opengrowth.track.delight('twitter.deleteTweet', request.message.signal, {
        email   : email
    ,   id      : request.message.id
    });
    return submitRequest(request);
};

function submitRequest (request) {
    const consumerKey = opengrowth.keys.twitter.consumerKey;
    const consumerSecret = opengrowth.keys.twitter.consumerSecret;
    const accessToken = opengrowth.keys.twitter.accessToken;
    const oauthTokenSecret = opengrowth.keys.twitter.oauthTokenSecret;

    const httpReqType = "POST";
    const contentType = "application/x-www-form-urlencoded";
    let url;
    if (request.message.tweet) url = "https://api.twitter.com/1.1/statuses/update.json";
    if (request.message.delete) url = `https://api.twitter.com/1.1/statuses/destroy/${request.message.id}.json`;

    if (!request.message.tweet && !request.message.delete) {
        return request.abort({ "400": "400: Bad Request" });
    }

    let tweetContent = request.message.tweet || "";
    let content = tweetContent ? "status=" + encodeURIComponent(tweetContent) : "";

    //Used in Authorization header and to create request signature
    let oauth = {
        "oauth_consumer_key": consumerKey,
        "oauth_nonce": base64.btoa(Math.random().toString(36)).replace(/(?!\w)[\x00-\xC0]/g, ""),
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": Math.floor(new Date().getTime() / 1000),
        "oauth_token": accessToken,
        "status": tweetContent
    };

    if (request.message.delete) delete oauth.status; //there is no status when deleting a Tweet
    
    return getOAuthSignature(oauth, httpReqType, url, consumerSecret, oauthTokenSecret).then((result) => {
        oauth.oauth_signature = result;
        delete oauth.status; //this is required to make the signature but not the Auth header
        let authHeaderString = objectToRequestString(oauth, 'OAuth ', '="', '"', ', ');

        let http_options = {
            "method": httpReqType,
            "headers": {
                "Content-Type": contentType,
                "Authorization": authHeaderString
            },
            "body": content
        };
        
        return xhr.fetch(url, http_options).then((response) => response.json()).then((response) => {
            //the successfully posted/deleted Tweet's id can be referenced here with response.id_str
            return request.ok();
        });
    })
    .catch((error) => {
        return request.abort({ "500": "500: Internal server error" });
    });
};

//Part of OAuth that creates a signature that's unique to each request
function getOAuthSignature(oauth, httpReqType, url, consumerSecret, oauthTokenSecret) {
    let parameterString = objectToRequestString(oauth, '', '=', '', '&');
    let signatureBaseString = httpReqType + "&" + encodeURIComponent(url) + "&" + encodeURIComponent(parameterString);
    let signingKey = base64.btoa(encodeURIComponent(consumerSecret) + "&" + encodeURIComponent(oauthTokenSecret));
    return crypto.hmac(signingKey, signatureBaseString, crypto.ALGORITHM.HMAC_SHA1).then((result) => {
        return result;
    });
}

//parses and percent encodes strings that become HTTP request headers
function objectToRequestString(obj, prepend, head, tail, append) {
    let requestString = prepend || "";
    Object.keys(obj).forEach((key, i) => {
        requestString += key + head + encodeURIComponent(obj[key]) + tail;
        i < Object.keys(obj).length-1 ? requestString += append : null;
    });
    return requestString;
}