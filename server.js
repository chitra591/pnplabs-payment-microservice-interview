const express = require('express')
const app = express()
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('mongodb://root:payment@ds135039.mlab.com:35039/payment_microservice', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listing on 3000');
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('users').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {users: result})
  })
})

app.get('/check_balance/:id', (req, res) => {
  db.collection('users').aggregate([
    {$unwind : "$accounts" },
    {$match : {"accounts.id": req.params.id}},
    {$project : { balance : "$accounts.balance" }},
  ]).toArray((err, result) => {
    console.log(result);
    if (err) return console.log("Error:"+err)
    res.send({balance: result})
  })
})
var filtered_result;
app.put('/withdraw', (req, res) => {
  var user_id, account_id, balance;

  filtered_result = db.collection('users').aggregate([
    {$unwind : "$accounts" },
    {$match : {"accounts.id": req.body.account_id}},
    {$project : {
      user_id: "$id",
      account_id: "$accounts.id",
      balance : "$accounts.balance"
    }}
  ])

  filtered_result.forEach((result) => {
    var new_balance
    balance = result.balance
    if(req.body.withdrawal_amount <= balance) {
      new_balance = balance-req.body.withdrawal_amount

      db.collection('users').update(
        {'id': result.user_id, 'accounts.id': result.account_id},
        {$set:{'accounts.$.balance': new_balance }},
        (err, result) => {
          if (err) return console.log("ERROR: "+err);
          res.redirect('/')
        }
      )
    }else {
      res.send({serverResponse: {type: 'ERROR', message: 'Insufficient balance.'}})
    }
  })
})
