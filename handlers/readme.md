# Open Growth Signals and Delights

**Signal** - An indication of a task that needs to be done automatically using Open Growth

**Delight** - A method of outreach to your customer i.e. email, text, tweet, special delivery of cake :cake:

See our existing delights in `open-growth/delights/`

The core vision of Open Growth is to automate tedious workforce tasks and give humans more time to work on the big picture. Open Growth’s **Signals** and **Delights** are an excellent resource to automate email correspondence with your vast customer base. A lone developer can get an automatic email system up and running in a few minutes using Open Growth. We will explain how to set up an automatic email to your newest customers when they sign up for your service.

First, there needs to be a source of the emails you send. We will call this a **Signal Generator**. The Signal Generator needs to collect customer information, like email address, and publish the Signal to Open Growth. This can be accomplished by a program that automatically runs every so often using a service like [Cron](https://en.wikipedia.org/wiki/Cron). The program can query your customer database for any new sign ups, and publish a message to your PubNub Open Growth instance immediately. You can also accomplish this using PubNub to publish directly from your Web Application.

The signal can be published to [PubNub](https://www.pubnub.com/) using one of the [70+ SDKs](https://www.pubnub.com/docs), or with an [HTTP](https://www.pubnub.com/http-rest-push-api/) request. 

```javascript
{
  "signal" : "signup",
  "email" : "bob@customer.com"
}
```

The message you send to PubNub will be enriched, in transit, by [BLOCKS](https://www.pubnub.com/products/blocks/) and it will be sent to your customer by the **delight** of your choosing (`open-growth/delights/`). You can enrich the customer data, decide the content of your email, and finally send the email using the SendGrid or SendWithUs delight. If you use a different email API service, you can create your own delight!

We can accomplish automation with an [XHR](https://www.pubnub.com/docs/blocks/xhr-module) to **Clearbit**, **MonkeyLearn**, and **SendGrid**.

 * [Clearbit](https://clearbit.com/) is used to find a customer’s name, place of work, industry, and other important details, by **providing only an email address**.

 * [MonkeyLearn](http://monkeylearn.com/) is a Machine Learning API which we use to determine a customer’s use case for your service, by using past customer data and ML.

* The [SendGrid](https://sendgrid.com/) Delight is used to send the email by plain text, or with a colorful HTML/CSS template.

The data enrichment modules should be called in the [signals.js](https://github.com/pubnub/open-growth/blob/master/handlers/signals.js) handler, which is a [Before Publish or Fire handler](https://www.pubnub.com/docs/blocks/event-handler-types#sync-et-before-pub-fire).

The delight function should be called in the [delights.js](https://github.com/pubnub/open-growth/blob/master/handlers/delights.js) handler, which is an [After Publish or Fire handler](https://www.pubnub.com/docs/blocks/event-handler-types#async-et-after-pub-fire).

In this example, we will make an XHR to Clearbit to get customer name, job title, and company name and then MonkeyLearn to determine this customer’s use case from company description, and/or job title.

After we have enriched our customer JSON object, we can decide the content of their email based on the signal name. Using logic, we can produce an email body like:
```
Hi Bob!

Thanks for signing up for our service!
We see you are a C developer and you work at IOT company.
Here is a link to our C SDK and here is a link to an Arduino Tutorial.

https://www.pubnub.com/docs/posix-c/pubnub-c-sdk
https://www.pubnub.com/docs/arduino/data-streams-publish-and-subscribe

Welcome!

Neumann
```

We will decide this content in the `opengrowth.signals.signup` handler, which we can create a file for in `open-growth/signals/`. 