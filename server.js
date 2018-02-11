var express = require('express');
var axios = require('axios');
var bodyParser = require('body-parser');
var xml2json = require('xml2json');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_URL = "https://api.telegram.org/bot" + TELEGRAM_TOKEN;

var app = express();
app.use(express.static('public'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


function getInfoKampus(){

}


app.post("/", function(request, response) {
  var input = request.body;
  
  var message = input.message;
  if (message.text == '/info_kampus'){
  
  }
  
  
  axios({
  method: 'post',
    url: API_URL + '/sendMessage',
    data: {
      'chat_id': input.message.chat.id,
      'text': 'Anda mengirim: ' + input.message.text
    }
  });
  
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
