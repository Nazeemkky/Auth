//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});



const User = mongoose.model("User", userSchema);




app.get("/",function(req, res){
  res.render("home");
});
app.get("/register",function(req, res){
  res.render("register");
});
app.get("/login",function(req, res){
  res.render("login");
});

app.post("/register", function(req, res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      // Store hash in your password DB.
      const newUser = new User({
        email:req.body.username,
        password:hash
      })
      newUser.save(function(err){
        if (err) {
          res.send(err);
        } else {
          res.render("secrets")
        }
      });
  });


});

app.post("/login", function(req, res){

  const  username = req.body.username
  const  password = req.body.password

User.findOne({email:username}, function(err, showuser){
  if (err) {
    console.log(err);
  } else {
    if(showuser){
      bcrypt.compare(password, showuser.password, function(err, result) {
          // result == true

          if (result === true) {
            res.render("secrets");
          }
      });
    }
  }
})

})








app.listen(3000, function(){
  console.log("Post is 3000");
})
