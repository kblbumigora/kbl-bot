var express = require('express'); // express framework
var axios = require('axios'); // modul untuk melakukan HTTP Request
var bodyParser = require('body-parser'); // modul untuk parse body
var xml2json = require('xml2json'); // modul untuk mengubah XML menjadi JSON
var moment = require('moment'); // Modul untuk manipulasi waktu

// URL yang digunakan untuk kirim pesan ke Telegram
const API_URL = "https://api.telegram.org/bot" + process.env.TELEGRAM_BOT_TOKEN;

var app = express();
app.use(express.static('public'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


/*
  Fungsi untuk mengambil RSS Feed dari website kampus lalu mengirimnya ke Bot
*/
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
      message.text = `<a href="${item[i].link}">${item[i].title}</a>  (${dateAgo})`;
      sendMessage(message);
    }    
    
  })
  .catch(function (error) {
    console.log(`Terjadi masalah: ${error}`);
  });
}

/*
  Fungsi untuk mengirim pesan ke Telegram
  Parameter: message adalah objek dari message yang berisi { chat: {id: balas ke id ini}, text: "text yang akan dikirim" }
  parameter: parse adalah format string yang digunakan default-nya HTML. Bisa uga menggunakan markdown
*/
function sendMessage(message, parse='HTML'){
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

/*
  Semua pesan dari telegram akan diterima dari route ini
*/
app.post("/", function(request, response) {
  var input = request.body;
  
  var message = input.message;
  
  if (message.text == '/info_kampus'){
      infoKampus(message);
  }
  
  message.text = "Apa kabar?";
  sendMessage(message);
  
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
