const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app= express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


mongoose.connect("mongodb+srv://admin-vinayak:WsUMgGzGLW75QVuR@cluster0.xgcqw.mongodb.net/Login", { useNewUrlParser: true ,useUnifiedTopology: true });


const users= new mongoose.Schema({
username:{
	type:String,
	requied: true,
   unique: true,
   minlength:12,
   maxlength:25
	},
	password:{
    type:String,
	requied: true,
	minlength:8,
    maxlength:15
	}
});


const User = new mongoose.model("User", users);


//////////////////////////////////////////// Get Requests ////////////////////////////////////////

app.get("/", function(req,res){
	res.render("home");
})

app.get("/register", function(req,res){
	res.render("register");
})

app.get("/login", function(req,res){
	res.render("login");
})

////////////////////////////////////////////// Post Requests ///////////////////////////////////////

app.post("/register",function(req,res){

const a= new User({
	username: req.body.username,
	password: req.body.password
});

User.findOne({username:req.body.username},function(err,found){
	if(found){
		res.render("faliure",{faliure:"username already exists"});
	}else{
		a.save(function(err){
	if(!err){
		res.redirect("/");
	}else{
		res.render("faliure",{faliure:err});
	}
})
	}
})



});

app.post("/login",function(req,res){
	
	User.findOne( {username:req.body.username},function(err,found){
          if(!found){
          	res.render("faliure",{faliure:"Account not found. Make sure that you have registered yourself."});
          }else{
          	if(req.body.password===found.password){
          		res.render("success",{username:found.username, password:found.password});
          	}else{
          		res.render("faliure",{faliure:"Password Incorrect"});
          	}
          }
	});

})

let port = process.env.PORT;
if (port == null || port == "") {
port = 8000;
}

app.listen(port, function(){
	console.log("Server started");
});