var express = require('express');
var axios = require('axios');
var bodyParser = require('body-parser');
var xml2json = require('xml2json');
var moment = require('moment');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_URL = "https://api.telegram.org/bot" + TELEGRAM_TOKEN;

var app = express();
app.use(express.static('public'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Global variabel untuk menampung message dari telegram
var message = "";

// Ambil item dari RSS Feed dan kembalikan dalam bentuk JSON array
function getFeedItem(url){
  var req = axios.get(url)
  .then(function (response) {
    //console.log(response.data);
    var jsonFeed = xml2json.toJson(response.data);
    var feed = JSON.parse(jsonFeed);
    return feed.rss.channel.item;
  });
}


function infoKampus(message){
  // var req = axios.get('http://website.stmikbumigora.ac.id/index.php/category/pengumuman/feed/')
  // .then(function (response) {
  //   //console.log(response.data);
  //   var jsonFeed = xml2json.toJson(response.data);
  //   var feed = JSON.parse(jsonFeed);
  //   var item = feed.rss.channel.item;
  //   for(let i = 0; i < 5; i++){
  //     //console.log(item[i].link);
  //     var date = new Date(item[i].pubDate);
  //     moment.locale('id'); // gunakan bahasa indonesia untuk momentjs
  //     var dateAgo = moment(date, "YYYYMMDD").fromNow();
  //     message.text = `${item[i].title}  ${item[i].link}  (${dateAgo})`;
  //     sendMessage(message);
  //   }
  //   //console.dir(item[0].title);
  // });
  
  var infoKampus = getFeedItem('http://website.stmikbumigora.ac.id/index.php/category/pengumuman/feed/');
  for(let i = 0; i < 5; i++){
      //console.log(item[i].link);
      var date = new Date(infoKampus[i].pubDate);
      moment.locale('id'); // gunakan bahasa indonesia untuk momentjs
      var dateAgo = moment(date, "YYYYMMDD").fromNow();
      message.text = `${infoKampus[i].title}  ${infoKampus[i].link}  (${dateAgo})`;
      sendMessage(message);
  }
}

function sendMessage(message){
  axios({
  method: 'post',
    url: API_URL + '/sendMessage',
    data: {
      'chat_id': message.chat.id,
      'text': message.text
    }
  });
}

app.post("/", function(request, response) {
  var input = request.body;
  
  var message = input.message;
  if (message.text == '/info_kampus'){
      infoKampus(message);
  }  
  
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
