// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Post on Customer's Wall on Facebook
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

opengrowth.delight.facebook = {};

//post a status update to the company page
opengrowth.delight.facebook.post = (request, email) => {
    // Record Delight Activity
    opengrowth.track.delight('facebook.post', request, {
        email: email,
        content: request.content
    });

    let accessToken = opengrowth.keys.facebook.accessToken;
    let pageId = opengrowth.keys.facebook.pageId;
    let baseUrl = "https://graph.facebook.com/";
    let status = encodeURIComponent(request.message.content) || "";

    if (!status) return request.abort({ "400": "400: Bad Request" });

    let url = "https://graph.facebook.com/v2.8/feed";

    let http_options = {
        "method": "POST",
        "body": `message=${status}&access_token=${accessToken}`
    };
    return xhr.fetch(url, http_options).then((response) => {
        return request.ok();
    }).catch((error) => {
        return request.abort();
    });
};

//reply to public posts that contain the company's name
opengrowth.delight.facebook.replyPublic = (request, email) => {
    // Record Delight Activity
    opengrowth.track.delight('facebook.replyPublic', request, {
        email: email,
        content: request.content
    });
};

//reply to incoming private messages sent to the company page
opengrowth.delight.facebook.replyPrivate = (request, email) => {
    // Record Delight Activity
    opengrowth.track.delight('facebook.replyPrivate', request, {
        email: email,
        content: request.content
    });
};
