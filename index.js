var {
  Client
} = require('pg')

let express = require("express");
var mustacheExpress = require('mustache-express');
let path = require("path");
var bodyParser = require('body-parser')

let meow;
let newpost = "";

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
  // connectionString: process.env.DATABASE_URL,
  // ssl: true,
});

client.connect();

app.get("/", function (req, res) {
  client.query("SELECT * FROM posts;", function (err, res) {
    if (err) {
      console.log(err)
    }
    meow = res.rows;
    console.log(res.rows)
    // client.end()
  })
  res.render('index', {
    meow
  })
})

app.post("/post", function (req, res) {
  newpost = req.body.secret
  client.query('INSERT INTO posts (message) VALUES ($1)', [newpost], function (err, res) {
    if (err) {
      console.log(err)
    }
    console.log("succeed")
  })
  return res.redirect('/');
})


// app.listen(process.env.PORT || 8000, function () {
//   console.log("listening on port 8000")
// })

app.listen(8000, function () {
  console.log("listening on port 8000")
})