---
layout: post
title:  "Deploying"
date:   2017-05-24 09:53:00 -0700
categories: update
---

# Deploying Your Own Open Growth Instance

To deploy your instance of Open Growth today, be sure to check out the Getting Started page and also download the repository if you haven't already.

First, sign up and retreive your API keys for any services you want to include in your instance. The current Open Growth release uses PubNub, Librato, SendGrid, MonkeyLearn and Clearbit. Open Growth can function with a minimum of PubNub however you will not be able to send any delights to customers. If you intend to use any message API services with Open Growth that are not in `open-growth/delights/` you can write your own delight!

Now that you have all of your API keys and credentials create a file called `keys.json` in the `open-growth/` directory. Follow the example in `keys.json.example`. Note that all of the credentials in `keys.json.example` are not required.

Next, explore the Signals and Delights event handlers in `open-growth/handlers/`. These files will become your BLOCKS event handlers when you deploy. A digram for the default execution flow can be found on the Getting Started page