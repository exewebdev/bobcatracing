var express = require('express');
var app = express();
var swig = require('swig');
var bodyParser = require('body-parser');
var fs = require('fs');

var config;
//Create new config file if one not found
try {
    config = require('./config.js');
} catch (e){
    fs.writeFileSync('./config.js', fs.readFileSync('./config.js.example'));
    console.log("New config file config.js created");
    config = require('./config.js');
}

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
    res.render("index.html");
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