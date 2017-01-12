// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Libs
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var config = require('./config')
var pubnub = require('pubnub')
var bodyParser = require('body-parser')

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// SendGrid
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
module.exports = function (app) {
    // Tell express to use the body-parser middleware
    //app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.post( '/sendgrid', function( request, response ) {
        console.log(request);

        var pn = new pubnub({
              "publishKey"   : process.env.TESTPUBKEY
            , "subscribeKey" : process.env.TESTSUBKEY
        });
        
        pn.publish({
              "channel" : "sg_analytics"
            , "message" : request.body
        });

        //tell sendgrid 200 ok.
        response.sendStatus(200);
    });
};


// var jsonParser = bodyParser.json({ type: 'application/*+json'});
// var router = express.Router();

// router.post('/', jsonParser, function(req, res) {