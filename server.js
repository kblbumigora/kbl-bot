var express = require('express');
var axios = require('axios');
var bodyParser = require('body-parser');
var FeedParser = require('feedparser');

var app = express();
app.use(express.static('public'));

var req = axios.get('http://website.stmikbumigora.ac.id/index.php/category/pengumuman/feed/')
  .then(function (response) {
    //console.log(response);
    var feedparser = new FeedParser();
    
    response.data.pipe(feedparser);

    feedparser.on('readable', function () {
      // This is where the action is!
      var stream = this; // `this` is `feedparser`, which is a stream
      var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
      var item;

      while (item = stream.read()) {
        console.log(item);
      }
    });
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
