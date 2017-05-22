# Open Growth Modules

Modules are used to make [XHRs](https://www.pubnub.com/docs/blocks/xhr-module) from your Open Growth BLOCK. They are good for getting data from an external APIs like [ClearBit](https://clearbit.com/), or passing Open Growth data along to an API like [Librato](https://www.librato.com/) for real-time monitoring.

The files in the `open-growth/modules/` directory are appended to both the **signals.js** and **delights.js** event handlers, so they can be called from anywhere in your Open Growth BLOCK.

Modules make requests that do not pertain to customer delights. Any XHRs that send an email, text, tweet, or slice of cake should be located in `open-growth/delights/`.