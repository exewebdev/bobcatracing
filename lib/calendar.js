var google = require("../node_modules/googleapis");
var googleAuth = require('../node_modules/google-auth-library');
var config = require('../config');
var fs = require("fs");

var calendarId  = process.env.GOOGLE_CALENDAR_ID || config.google.calendar_id || "primary"; //Using primary calendar as a default
// Load client secrets from a local file.
fs.readFile(__dirname + '/auth/google-svc-auth.json', function processClientSecrets(err, content) {
    if (err) {
        console.log('Error loading Google client secret file: ' + err);
        authorize({
            client_email : process.env.GOOGLE_CLIENT_EMAIL,
            private_key : process.env.GOOGLE_CLIENT_PK
        });
        return;
    }
    authorize(JSON.parse(content));
});

var authorize = function(credentials) {
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2();
    var jwt = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        ['https://www.googleapis.com/auth/calendar']);	
    jwt.authorize(function(err, result) {
        oauth2Client.setCredentials({
            access_token: result.access_token
        });
        google.options({ auth: oauth2Client });
    });
};

module.exports = {
    //Returns a certian number of events from the primary calendar.
    getEvents: function(eventNumber, callback){
        var calendar = google.calendar('v3');
        calendar.events.list({
            calendarId: calendarId,
            timeMin: (new Date().toISOString()),
            maxResults: eventNumber,
            singleEvents: true,
            orderBy: 'startTime'
        }, function(err, response) {
            if (err){
                callback(err, null);
                return false;
            } else {
                var events = response.items;
                if (events.length == 0){
                    callback("No events", null);
                } else {
                    //Parse & replace start dates with actual date objects
                    for (var i = 0; i < events.length; i++){
                        events[i].start.dateTime = new Date(events[i].start.dateTime);
                    }
                    callback(false, events);
                }
            }
        });
    }
};
