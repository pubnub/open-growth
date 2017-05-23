# Open Growth Signals and Delights

**Signal** - An indication of a task that needs to be done automatically using Open Growth

**Delight** - A method of outreach to your customer i.e. email, text, tweet, special delivery of cake 🍰

The **signals.js** and **delights.js** files in `open-growth/handlers/` are PubNub BLOCKS [Event Handlers](https://www.pubnub.com/docs/blocks/event-handlers). This is the code that is executed when a PubNub message is in transit.

The **Signals Handler** is a [Before Publish or Fire handler](https://www.pubnub.com/docs/blocks/event-handler-types#sync-et-before-pub-fire) and the **Delights Handler** is an [After Publish or Fire handler](https://www.pubnub.com/docs/blocks/event-handler-types#async-et-after-pub-fire).

The PubNub message that is sent is called a **Signal**. Open Growth processes the Signals and sends **Delights** to your customers

In Open Growth, we perform data enrichment in the Signals Handler, and send [Customer Delights](https://github.com/pubnub/open-growth/tree/master/delights) from the Delights Handler.

Example execution flow of Open Growth for a new sign up

![open-growth-signal-diagram](http://i.imgur.com/7KgsdV1.png)