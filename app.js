var User = require('./app-server/schemas/user');
var express = require('express');
var mongoose = require('mongoose');
var app = express();
const mongoDB = 'mongodb://admin:popitipapiti123456@ds231315.mlab.com:31315/differentangle';

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


mongoose.connect(mongoDB, {
    useMongoClient: true
});

//Get the default connection
var db = mongoose.connection;
var errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(200).send(err);
}
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.static(__dirname));

app.post('/api/users', function(req, res, next) {
    const landingPageUrl = req.body.landingPageUrl;
    const email = req.body.email;
    const fullName = req.body.fullName;
    const phone = req.body.phone;
    var message = 'done';
    if (landingPageUrl && landingPageUrl !== '' && email && email !== '' && fullName && fullName !== '' && phone && phone !== '') {
        // create a new user
        var chris = new User({
            landingPageUrl: landingPageUrl,
            email: email,
            fullName: fullName,
            phone: phone
        });
        //app.use(methodOverride())
        app.use(errorHandler)
        // call the built-in save method to save to the database
        chris.save(function(error, doc) {
            if (error) {
                if (error.name === 'MongoError' && error.code === 11000) {
                    return next('duplicate');
                } else {
                    return next('unknown');
                }
            }
            next('route')
            res.status(200).send('success');
        });
    }
});

app.get('*', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.listen(process.env.PORT || 3000);