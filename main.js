var {
  Client
} = require('pg')

let express = require("express");
var mustacheExpress = require('mustache-express');
let path = require("path");
var bodyParser = require('body-parser')

let meow = [];
let newpost = "";

const text = 'INSERT INTO posts (message) VALUES($1)'
const values = ['4th row']

let app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname);

var client = new Client({
  database: 'webforum'
});

client.connect();












app.get("/", function (req, res) {
  client.query("SELECT * FROM posts;", function (err, res) {
    if (err) {
      console.log(err)
    }
    for (let row of res.rows) {
      meow.push(JSON.parse((JSON.stringify(row))).message)
    }
    // client.end()
  })
  res.render('index', {
    meow: meow
  })
})

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"))
})

// client.query("INSERT INTO posts (message) VALUES (" + newpost + ")", function (err, res) {
//   if (err) {
//     console.log(err)
//   }
//   for (let row of res.rows) {

//     meow.push(JSON.parse((JSON.stringify(row))).message)
//     //console.log(row)

//   }
//   client.end()
// })

app.post("/post", function (req, res) {
  newpost = req.body.secret
  // res.send(newpost)
  client.query("INSERT INTO posts (message) VALUES ('" + req.body.secret + "');", function (err, res) {
    if (err) {
      console.log(err)
    }
    console.log("succeed")

    //client.end()
  })



  console.log(req.body.secret)
  client.query("SELECT * FROM posts;", function (err, res) {
    if (err) {
      console.log(err)
    }
    for (let row of res.rows) {
      meow.push(JSON.parse((JSON.stringify(row))).message)
    }
    client.end()
  })
  return res.sendfile(__dirname + '/index.html');
})

app.post("/post", function (req, res) {

})




// app.post("/post", function (req, res) {

//   console.log(meow)
// })

// app.get("/submit", function (req, res) {

//   //res.send(req.query.secret)

// })



app.listen(8000, function () {
  console.log("listening on port 8000")
})