# Open Growth Helpers

The files in the `open-growth/helpers/` directory are appended to both the signals.js and delights.js event handlers, so they can be called from anywhere in your Open Growth BLOCK.

The naming convention for helper functions is `opengrowth.helperName.functionName`. All helpers are added to the `opengrowth` object.

Helper's can access modules like in `opengrowth.customer.getUseCase` in the **customer.js** helper. The purpose is to determine a use case using MonkeyLearn based on customer data.