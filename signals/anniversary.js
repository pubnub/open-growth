opengrowth.signals.anniversary = ( request, customer ) => {
    var tweet = "I'm sorry Dave, I can't do that."
    return opengrowth.delight.twitter.tweet(request, tweet);
};
