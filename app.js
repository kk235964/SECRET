require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
mongoose.set('strictQuery', true);

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
mongoose.connect( "mongodb+srv://kamal235964:kk235964@firstcluster.c5ke5dw.mongodb.net/test",{useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
   
});
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]},);


const User = new mongoose.model("User", userSchema);

app.get("/", function(req,res){
res.render("home");
});
app.get("/logout", function(req,res){
res.render("home");
});

app.get("/login", function(req,res){
res.render("login");
});

app.get("/register", function(req,res){
res.render("register");
});

app.post("/register", function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password,
        cpassword: req.body.cpassword
    });
    newUser.save(function(err){
        if (err){
            console.log(err);
        }
        else {
            if(req.body.password===req.body.cpassword){
            res.render("secrets");
            }
            else {
                res.send(404,'Password and confirm Password do not match');
            }
        }
    });
});

app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            res.send(err);
        }
        else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("secrets");
                }
               else { res.status(404).send('Invalid Username or Password');}
            }
            else{ res.status(404).send( 'User does not exist!');}
        }
    });
});


app.listen(3000, function(){
    console.log("Server is started on port 3000");
});