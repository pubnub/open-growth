# Open Growth Signals and Delights

**Signal** - An indication of a task that needs to be done automatically using Open Growth

**Delight** - A method of outreach to your customer i.e. email, text, tweet, special delivery of cake 🍰

The **signals.js** and **delights.js** files in `open-growth/handlers/` are PubNub BLOCKS [Event Handlers](https://www.pubnub.com/docs/blocks/event-handlers). This is the code that is executed when a PubNub message is in transit.

The **Signals Handler** is a [Before Publish or Fire handler](https://www.pubnub.com/docs/blocks/event-handler-types#sync-et-before-pub-fire) and the **Delights Handler** is an [After Publish or Fire handler](https://www.pubnub.com/docs/blocks/event-handler-types#async-et-after-pub-fire). The PubNub message that is sent is called a **Signal**. Open Growth processes Signals from your Signal Generator and sends **Delights** to your customers.

With the default setup for Open Growth, we perform data enrichment in the Signals Handler, and send [Customer Delights](https://github.com/pubnub/open-growth/tree/master/delights) from the Delights Handler.

Example execution flow for a new sign up:

![open-growth-signal-diagram](http://i.imgur.com/pGskE9v.png)

The Signal Generator can be an existing web application, [Cron](https://en.wikipedia.org/wiki/Cron) job, etc. that publishes a PubNub message to your Open Growth instance whenever there is a new sign up for your service. The message can be sent by using one of the [70+ PubNub SDKs](https://www.pubnub.com/docs#all-sdks-home) or an [HTTP POST](https://www.pubnub.com/http-rest-push-api/) request.

Note that the Delights Handler can also send updates to your services and customer delights at the same time. By default, the Delights Handler **logs** all of your Open Growth BLOCK activity to the `opengrowth.logs` channel.