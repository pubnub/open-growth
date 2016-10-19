![Open Growth](http://i.imgur.com/Pug4ybX.gif)

> Transform salesman into sales heroes.
Replace sales outreach with a Machine Learning engine.
No more sales spam.
Open Growth is an open source project for developers at 
API companies to delight your customers with ML/AI.

## ❤️  Delight Your Customers

> **Sendgrid + ScaleAPI + PubNub + MonkeyLearn + Twilio**

The modern growth engine asks your customers to connect,
only when they are ready.
This is the natural approach.
Invite your customers to connect directly with your experts.
When the customer is ready,
they will initiate the conversation with your team of experts.
You provide valuable messages over SMS/Voice/Email/Social.

## ♻️  Presentation Link

How does Open Growth work?

[Google Slide Presentation](https://docs.google.com/presentation/d/1AwuSLz5Cm2psVG1_0sdiMhrHSjmQe-bzVnXZJGMfxdY/edit?usp=sharing)

## ☀️  Capabilities

 - CLI programmable growth engine
    - Export to SQL for Data Mining (sqldump)
    - List Signals and associated cURL commands.
    - Analytics
 - GUI (coming soon)

## Signals Trigger Delights

Your customers need information.
Your team of experts can help!
Start by sending relevant details to your customers.
Signals are points in time that indicates customer activity.
Send delights and information to your customers in realtime.

| Signal > | Delight ML Foresight >   | Reaction >   | Connect to Expert    |
| -------- | ------------------------ | ------------ | -------------------- |

## Install Open Growth

```shell
sudo npm install -g opengrowth  ## Open Growth CLI
```

## Start Project

```shell
opengrowth setup
```

Follow the setup guide to create your custome rules engine.
You'll be prompted to create your accounts on developer API compaines.

## Data Channels

Data Channels are logs of signals, events and prospects.

 - `opengrowth.signals`   - when a prospect does something, run rules engine.
 - `opengrowth.delights`  - multi-channel message sent to prospect.
 - `opengrowth.reactions` - prospect requests to meet with sales.
 - `opengrowth.propsects` - list of augmented propspect profiles.


## Analytics Keys

  - `signals`
  - `delights`
  - `reactions`
  - `prospects`

Hourly, Daily and Monthly counts are available as well.
The first hour of May 2016 can be fetched with this key:
`opengrowth-analytics.signals.2016-05-01-00`.

```javascript
// Get Total Signals Value
opengrowth.analytics.signals( total => {
    console.log(`Total signals {total}.`);
} );
```
