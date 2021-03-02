const express = require('express');
const router = express.Router();
const pool = require('../public/javascripts/dbConnection');
var carNumber = 0;
var cars = [];

class Destination {
  constructor(src, title, description) {
    this.src = src;
    this.title = title;
    this.description = description;
  }
}

const destinations = [
  new Destination('images/gaspesie.jpg', 'La Gaspésie', ''),
  new Destination('images/mont_tramblant.jpg', 'Le Mont Tramblant', ''),
  new Destination('images/quebec.jpg', 'Quebec', ''),
  new Destination('images/hiver_quebec.jpg', 'L\'expérience hivernale', '')
]

class Car {
  constructor({ID_VOITURE, PLAQUE_IMMATRICULATION, MODELE, COULEUR, ETAT, URL_IMAGE, DESCRIPTION_VOITURE}) {
    this.src = URL_IMAGE;
    this.title = MODELE;
    this.description = DESCRIPTION_VOITURE;
  }
}

pool.getConnection(function(err, connection) {
  if (err) throw err;

  connection.query("SELECT * FROM VOITURE GROUP BY MODELE ORDER BY MODELE", function (err, results, fields) {
    if (err) throw err;
    results.forEach((car) => {
      cars.push(new Car(car));
    });
  });

  connection.release();
});

router.get('/', function(req, res, next) {
  res.render('index', { destinations, cars });
});

module.exports = router;
