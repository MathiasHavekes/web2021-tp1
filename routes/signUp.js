const express = require("express");
const router = express.Router();
const pool = require("../public/javascripts/dbConnection");
const { body, validationResult } = require("express-validator");

var isOnline = (userId) => {
  if (userId >= 0) {
    return true;
  } else {
    return false;
  }
};

router.get("/", (req, res, next) => {
  res.render("signup", { userId: isOnline(req.session.userId) });
});

router.post("/submit", (req, res, next) => {
  const { surname, name, phone, email, password, confirmedPassword } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "SELECT EMAIL FROM CLIENT WHERE EMAIL= ?",
      [email],
      (err, results, fields) => {
        if (err) throw err;
        if (results.length > 0) {
          console.log("Cet Email est deja utilisé");
          res.redirect("/signUp");
        }
      }
    );

    if (err) throw err;
    connection.query(
      "INSERT INTO CLIENT SET ?",
      {
        NOM: name,
        PRENOM: surname,
        MOT_DE_PASSE: password,
        EMAIL: email,
        TELEPHONE: phone,
      },
      (err, results, fields) => {
        if (err) throw err;
        res.redirect("/logIn");
      }
    );
    connection.release();
  });
});

module.exports = router;
