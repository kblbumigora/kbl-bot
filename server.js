var express = require('express');
var axios = require('axios');
var bodyParser = require('body-parser');
var FeedParser = require('feedparser');
var xml2json = require('xml2json');

var app = express();
app.use(express.static('public'));

var req = axios.get('http://website.stmikbumigora.ac.id/index.php/category/pengumuman/feed/')
  .then(function (response) {
    //console.log(response.data);
    var jsonFeed = xml2json.toJson(response.data);
    var feed = JSON.parse(jsonFeed);
    var item = feed.rss.channel.item;
    var title
    console.dir(item[0].title);
});


app.post("/", function(request, response) {
  
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});



// Simple in-memory store for now
// var dreams = [
//   "Find and count some sheep",
//   "Climb a really tall mountain",
//   "Wash the dishes"
// ];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
