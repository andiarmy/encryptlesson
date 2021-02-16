//jshint esversion:6

///////////////////////////////////////Boiler Plate///////////////////////////////////////

require('dotenv').config()
const express = require("express");
const bodyParser  = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

///////////////////////////////////// Connect DB ////////////////////////////////////////////

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

// // Set Schema
// const userSchema = {
//   email: String,
//   password: String
// };

// Set Schema using Encryption
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

// const secret = "Thisisourlittlesecret."; --> pindah ke .env karena menggunakan dotenv
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

// Set Model (collection name, schema)
const User = mongoose.model("User", userSchema);

///////////////////////////////////// Render Pages ////////////////////////////////////////////

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

///////////////////////////////////// Grab Data from Forms ////////////////////////////////////////////

// Register Rpoute
app.post("/register", function(req, res) {
  const newUser = new User ({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

// Login route
app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });

});



////////////////////////////////////// Listen Port ///////////////////////////////////////////////

app.listen(3000, function() {
  console.log("Server started at port 3000");
});
