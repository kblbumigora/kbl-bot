var express = require('express');
var axios = require('axios');
var bodyParser = require('body-parser');
var xml2json = require('xml2json');
var moment = require('moment');

const API_URL = "https://api.telegram.org/bot" + process.env.TELEGRAM_BOT_TOKEN;

var app = express();
app.use(express.static('public'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Global variabel untuk menampung message dari telegram
//var message = "";


function infoKampus(message){
  var req = axios.get('http://website.stmikbumigora.ac.id/index.php/category/pengumuman/feed/')
  .then(function (response) {
    //console.log(response.data);
    var jsonFeed = xml2json.toJson(response.data);
    var feed = JSON.parse(jsonFeed);
    var item = feed.rss.channel.item;
    
    
    for(let i = 0; i < 5; i++){
      var date = new Date(item[i].pubDate);
      moment.locale('id'); // gunakan bahasa indonesia untuk momentjs
      var dateAgo = moment(date, "YYYYMMDD").fromNow();
      message.text += `<a href="${item[i].link}">${item[i].title}</a>  (${dateAgo})<br/>`;
      sendMessage(message);
    }
    
  })
  .catch(function (error) {
    console.log(`Terjadi masalah: ${error}`);
  });
}

function sendMessage(message, parse='HTML'){
  console.dir(message.chat.id);
  
  axios({
  method: 'post',
    url: API_URL + '/sendMessage',
    data: {
      'chat_id': message.chat.id,
      'text': message.text,
      'parse_mode': parse
    }
  }).catch(function (error) {
    //console.log(API_URL + '/sendMessage');
    //console.log( message.chat.id );
    console.log(`Terjadi masalah: ${error}`);
  });
}

app.post("/", function(request, response) {
  var input = request.body;
  
  var message = input.message;
  
  if (message.text == '/info_kampus'){
      infoKampus(message);
  }
  
  sendMessage("apa kabar!");
  
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
