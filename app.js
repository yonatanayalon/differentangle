var User = require('./app-server/schemas/user');
var express = require('express');
var mongoose = require('mongoose');
const request = require('request-promise-native')
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

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.static(__dirname));

app.post('/api/users', function(req, res) {
    if (req.body.landingPageUrl && req.body.landingPageUrl !== '' && req.body.email && req.body.email !== '' && req.body.fullName && req.body.fullName !== '' && req.body.phone && req.body.phone !== '') {
        // create a new user
        var chris = new User({
            landingPageUrl: 'http://www.testing.com',
            email: 'ggg@mail.com',
            fullName: 'Chris',
            phone: '05982232456'
        });

        // call the built-in save method to save to the database
        chris.save(function(err) {
            if (err) throw err;
            console.log('User saved successfully!');
        });
        res.sendStatus(200);
    }
});

app.get('*', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.listen(process.env.PORT || 3000);