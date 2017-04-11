opengrowth.signals.anniversary = (request, customer) => {
    let handle = customer.person.twitter.handle || null;
    let years = request.message.years || null;
    
    if(!handle || !years) return request.abort();

    let text = "Hey @"
             + handle
             + ", you've been a @pubnub customer for "
             + years
             + " years! Happy Anniversary!";

    // @if GOLD
    return opengrowth.delight.twitter.tweet(request, text);
    // @endif
    console.log(text);
    return request.ok();

};