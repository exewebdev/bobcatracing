var fs = require('fs');
var config;
//Create new config file if one not found
if (fs.existsSync('/config.js')) {
    config = require('./config');
} else {
    fs.writeFileSync('./config.js', fs.readFileSync('./config.js.example'));
    config = require('./config');
}

var express = require('express');
var app = express();
var calendar = require('./lib/calendar.js');
var swig = require('swig');
var bodyParser = require('body-parser');


//Use Swig render engine as middleware for HTML files
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + "/public");

//If running in development mode, disable swig caching (so we don't have to restart the app)
if (config.production === false){
    console.warn("DEVLOPMENT MODE");
    app.set('view cache', false);
    swig.setDefaults({ cache: false });
}

//Begin express routes

//Route for homepage
app.get("/", function(req, res){
    calendar.getEvents(5, function(err, events){
        if (err && err != "No events"){
            console.error("Error fetching calendar events: " + err);
        }
        res.render("index.html", {calendar: events});
    });
});

//End express routes

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(process.env.PORT || config.port || 8080, process.env.HOST || config.host || '0.0.0.0', function(err){
    if (err){
        console.error(err);
    }
   console.log("Server running on port " + process.env.PORT || config.port || '8080'); 
});