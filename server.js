const express = require('express')
const app = express()
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
var AsyncLock = require('async-lock')

var lock = new AsyncLock()
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
    res.send({users: result})
  })
})

app.get('/user/:id', (req, res) => {
  db.collection('users').find(
    {"id": req.params.id}
  ).toArray((err, result) => {
    if (err) return console.log(err)
    res.send({users: result})
  })
})

app.get('/check_balance/:id', (req, res) => {
  db.collection('users').find(
    {"id": req.params.id}
  ).toArray((err, result) => {
    if (err) return console.log("Error:"+err)
    res.send({balance: result[0].balance})
  })
})

app.put('/withdraw', (req, res) => {
  lock.acquire(req.body.id, done => {
    db.collection('users').find(
      {"id": req.body.id}
    ).toArray((err, results) => {
      results.forEach((result) => {
        var new_balance = result.balance
        balance = result.balance
        if(req.body.withdrawal_amount <= balance) {
          new_balance = balance-req.body.withdrawal_amount

          db.collection('users').update(
            {'id': result.id},
            {$set:{'balance': new_balance }},
            (err, result) => {
              if (err) return console.log("ERROR: "+err);
              res.send({serverResponse: {type: 'SUCCESS', message: 'Balance = '+new_balance}, error: false})
            }
          )
        }else {
          res.send({serverResponse: {type: 'ERROR - Insufficient balance.', message: 'Balance = '+new_balance}, error: true})
        }
      })
      done()
    })
  }, (err, result) => {
      console.log("lock release")
  },
  {})
})
