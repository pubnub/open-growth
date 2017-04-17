opengrowth.signals.big_fish = (request, customer) => {
    const money = 100000000
    const people = 1000;

    const user = request.message;
    const csm = user.csm || {};
    const csm_bccs = csm && csm.bccs ? csm.bccs : [];
    let email = user.litmus || 'open-growth-activity+silver@pubnub.com';
    // @if GOLD
    email = csm.email;
    // @endif

    let firstName = opengrowth.customer.getFirstName(customer);
    let lastName = opengrowth.customer.getLastName(customer);
    let company_name = opengrowth.customer.getCompany(customer);
    let employees = opengrowth.customer.getEmployees(customer);
    let revenue = opengrowth.customer.getRevenue(customer);
    let raised = opengrowth.customer.getRaised(customer);
    let market_cap = opengrowth.customer.getMarketcap(customer);
    let bigly = false;

    if (raised >= money || revenue >= money || market_cap >= money || employees >= people) bigly = true;

    var template_data = {
        "customer_first_name": firstName,
        "customer_last_name": lastName,
        "customer_email": user.email,
        "company_name": company_name,
        "company_employees": employees,
        "company_revenue": revenue,
        "company_raised": raised,
        "company_market_cap": market_cap,
        "csm_first_name": csm.first_name,
        "csm_last_name": csm.last_name,
        "csm_email": csm.email,
        "csm_phone": csm.phone,
        "csm_bccs": csm_bccs,
        "sub_key": user.sub_key
    };

    var sendWithUsPostBody = {
        "template": opengrowth.keys.swu.templates.big_fish,
        "recipient": {
            "name": csm_first_name,
            "address": email
        },
        "sender": {
            "name": 'Neumann',
            "address": 'neumann@pubnub.com',
            "reply_to": 'neumann@pubnub.com'
        },
        "template_data": template_data,
        "tags": ["og_big_fish"]
    };

    // Send Email
    if (bigly) {
        return opengrowth.delight.sendwithus.email(sendWithUsPostBody);
    } else {
        return request.ok();
    }
};