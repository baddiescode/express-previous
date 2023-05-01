const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://kaminahoakes:kaminahoakes@personal-express-app.qxowqa8.mongodb.net/?retryWrites=true&w=majority";
const dbName = "palindrome";

app.listen(4040, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('words').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

app.post('/words', (req, res) => {
  const palin = req.body.word === req.body.word.split("").reverse().join("") ? "It's a Palindrome" : "Not a Palindrome"
  db.collection('words').insertOne({word: req.body.word, check: palin }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})


app.put('/words', (req, res) => {
  db.collection('words')
  .findOneAndUpdate({word: req.body.word, check: ""}, {
    // $set: {
    //   check:  
    // }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})


app.delete('/words', (req, res) => {
  db.collection('words').findOneAndDelete({word: req.body.word}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
