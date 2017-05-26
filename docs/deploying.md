---
layout: page
title:  Deploying
permalink: /deploying/
---

# Deploying Your Own Open Growth Instance

To deploy your instance of Open Growth today, be sure to check out the [Getting Started](/getting-started/) page and also download the [repository](https://github.com/pubnub/open-growth) if you haven't already.

## Services

First, sign up and retrieve your API keys for any services you want to include in your instance. The current Open Growth release uses [PubNub](https://www.pubnub.com/), [Librato](https://www.librato.com/), [SendGrid](https://sendgrid.com/), [MonkeyLearn](https://monkeylearn.com/) and [Clearbit](https://clearbit.com/). Open Growth can function with a minimum of PubNub however you will not be able to send any delights to customers. If you intend to use any message API services with Open Growth that are not referenced in `open-growth/delights/` you can write your own delight!

## Keys

Now that you have all of your API keys and credentials, create a file called `keys.json` in the `open-growth/` directory. Follow the example in `keys.json.example`. Note that not all of the credentials in `keys.json.example` are required.

## BLOCKS Event Handlers

Next, explore the **Signals** and **Delights** event handlers in `open-growth/handlers/`. These files will become your [BLOCKS](https://www.pubnub.com/products/blocks/) event handlers when you deploy. A diagram for the default execution flow can be found on the [Getting Started](/getting-started/) page. Remove code that calls any APIs that you do not have keys for.

## Signal Handlers

Some examples of signal handlers are provided. If you intend to create an automated sign up email, check out `open-growth/signals/signup.js` and adjust settings like the BCC and From default, email body content, and also which delight (API) call you want to send the email with. For any other signals you intend to handle, add a new file and handler function in `open-growth/signals/`.

## Deploying from the Command Line

Open Growth is currently deployed from the command line using node.js, gulp, and the PubNub portal API. If you have not already, install [node.js](https://nodejs.org/). Then navigate to in your `open-growth/` directory using the command line and run:

`npm install`

Next run the Open Growth deploy script using:

`./deploy` or `node deploy`

![Open Growth Deploy](http://i.imgur.com/c4dvjQp.png)

The first time you run the deploy script, you will be asked for a deploy password. This password will be used to encrypt your keys file. A new file will be generated called `keys.aes`. You can then remove your `keys.json` file, which will no longer be needed. However if you forget your password, you will have to delete `keys.aes` and regenerate it using `keys.json` with a new password.

The deploy script will generate your Open Growth key sets and deploy your code to BLOCKS. By default, the deploy script deploys your code to 1 of 3 environments: Gold (production), Silver (staging), and Bronze (testing). Bronze key sets will be created for each developer on your team. The deploy script names the Bronze key set using your command line user name: `Bronze - stephen`. Command line flags will direct which environment to deploy to.

To your Bronze BLOCK (testing):

`./deploy`

Silver (staging):

`./deploy --silver`

Gold (production):

`./deploy --gold`

Once the deploy script confirms that Open Growth was successfully deployed, log into the PubNub Admin Portal at [https://admin.pubnub.com/](https://admin.pubnub.com/)

![PubNub BLOCKS editor](http://i.imgur.com/9Hvoz23.png)

Navigate to the BLOCKS console for the environment you deployed to and publish a test Signal from the **Test Payload** area!

If you followed the sign up email signal example, the email address in your signal payload should receive a sign up email.

The signal that is published would ideally come from a separate component called a **Signal Generator**, which is explained [here](https://github.com/pubnub/open-growth/tree/master/generators). The Test Payload area in the BLOCKS console is good for testing out signals during development.
