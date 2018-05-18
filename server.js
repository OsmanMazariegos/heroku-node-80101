const express = require('express');
const MongoClient = require('mongodb').MongoClient
const bodyParser= require('body-parser')
var ObjectID = require('mongodb').ObjectID;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

var port = process.env.PORT || 8000

MongoClient.connect('mongodb://admin:Pa8irr@ds245238.mlab.com:45238/db_angular-pwa-app-firebase', (err, db) => {
  if (err) return console.log(err)

  app.listen(port, () => {
    console.log('app working on ' + port)
  });

  let dbase = db.db("db_angular-pwa-app-firebase");

  app.get('/', function(req, res) {
    res.send("Yep it's working");
  });

  app.post('/api/template/add', (req, res, next) => {

    let template = {
      full_name: req.body.full_name,
      u_id_tax: req.body.u_id_tax,
      i_will_pay: req.body.i_will_pay,
      pay_day: req.body.pay_day,
      pledge_amount: req.body.pledge_amount
    };

    dbase.collection("template").save(template, (err, result) => {
      if(err) {
        res.status(400).send("No se puede guardar en la base de datos");
        console.log(err);
      }
        res.status(200).json({'template': 'Plantilla añadida con éxito'});
    });

    

  });

  app.get('/api/template', (req, res, next) => {
    dbase.collection('template').find().toArray( (err, results) => {
      res.send(results)
    });
  });

  app.get('/api/template/:id', (req, res, next) => {
    if(err) {
      throw err;
    }

    let id = ObjectID(req.params.id);
    dbase.collection('template').find(id).toArray( (err, result) => {
      if(err) {
        throw err;
      }

      res.send(result);
    });
  });

  app.put('/api/template/update/:id', (req, res, next) => {
    var id = {
      _id: new ObjectID(req.params.id)
    };

    dbase.collection("template").update(id, {$set:{full_name: req.body.full_name,u_id_tax: req.body.u_id_tax,i_will_pay: req.body.i_will_pay, pay_day: req.body.pay_day, pledge_amount: req.body.pledge_amount}}, (err, result) => {
      if(err) {
        throw err;
      }

      res.send('user updated sucessfully');
    });
  });


  app.delete('/api/template/delete/:id', (req, res, next) => {
    let id = ObjectID(req.params.id);

    dbase.collection('template').deleteOne({_id: id}, (err, result) => {
      if(err) {
        throw err;
      }

      res.send('user deleted');
    });
  });

});