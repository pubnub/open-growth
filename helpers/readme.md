# Helpers

The files in the `open-growth/helpers/` directory are appended to both the **signals.js** and **delights.js** event [handlers](https://github.com/pubnub/open-growth/tree/master/handlers), so they can be called from anywhere in your Open Growth BLOCK.

The naming convention for helper functions is `opengrowth.helperName.functionName`. All helpers are added to the `opengrowth` object.

Helpers can access modules, like in `opengrowth.customer.getUseCase` in the **customer.js** helper. The purpose is to determine a use case using [MonkeyLearn](http://monkeylearn.com/) based on customer data. This extra abstraction can help make your event handler code easier to follow.