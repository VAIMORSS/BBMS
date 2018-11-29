const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const Sequelize = require("sequelize");
const bodyParser = require("body-parser");
const path = require("path");
const Handlebars = require("handlebars");
const HTTP_PORT = process.env.PORT || 8080;
const  fs = require("fs");
const dataFetcher=require("./dataFetcher.js");
const clientSessions = require("client-sessions");
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}   

app.use(bodyParser.urlencoded({ extended: true }));
app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.use(express.static('public'));
/******
 * 
 * All the Handlebars and their helpers 
 * 
 * 
 * ************** */

Handlebars.registerHelper('repeter',function(contex,option){
    console.log("Helper called...");
    var s="";
    for(var i=0;i<contex;i++){
        s+='<strong>'+option.fn(this) + '</strong>';
    }
    return s;
});

var i=0;//try to make this part in the client side server
Handlebars.registerHelper('repeter1',function(option){
    console.log("Helper called...");
    if(i>=dataContent.number){
        i=0;
    }
    i++;
    console.log(i);
    return i;
});

//helper to direct the request at the different part of the application

Handlebars.registerHelper('router',function(url, options){
    return '<li '+((app.locals.activeRoute==url)?'class="active"':'')+'> <a href="'+url+'">'+ options.fn(this)+'</a></li>';
});

//for refreash
app.use(function(req,res,next){
    let route=req.baseUrl+req.path;
    app.locals.activeRoute=(route=="/")?"/":route.replace(/\/$/,"");
    next();
})


app.set("view engine", ".hbs");

var data=fs.readFileSync("Json/data.json");
var dataContent = JSON.parse(data);

app.get("/", (req, res) => {
        res.render("viewTable");
});


/******
 * ALL from submissions 
 *
 */

 app.post("/endpoint",(req, res)=>{
  console.log("lala");

  res.send("<p>lala</p>");
  console.log(req.body);

  console.log(req.body.data);
  var json_data = JSON.parse(req.body.data);
//we are getting the string of the people who are presented now we just have to make sure that at a time more than one people can access this system 
//if we are sending some response to is there are some problem which says the "Can't set headers after they are sent to the client"
});

//client sessiion testing
app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "week10example_web322", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
  }));

  const user = {
    username: 'k',
    password: 'k'
  };

//testing done

function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      next();
    }
  }

app.post("/logIn", (req, res) => {
    
   if((req.body.userNameLn).toString()=='a' ){
    req.session.user={
        username:user.username,
        password:user.password
    };
    res.render("layouts/main",{
        data:dataContent
    });
    
   }else{
       res.redirect("/");
   }
});

app.get("/addPerson",ensureLogin,(req,res)=>{
    dataFetcher.addPerson(req.body).then((data=>{
        console.log(req.body);
    }));
    res.redirect("/addPerson");
});

//////////////From Submission //////////////
app.get("/attendance",ensureLogin,(req,res)=>{
    res.render("attendanceView",{
        data: dataContent,
        layout: "main"    
    });
    
});
    
app.get("/signUp",(req,res)=>{
    res.render("signup",{
        layout:"main",
        data: dataContent
        
    });
});


app.get("/monthlyReport",ensureLogin,(req,res)=>{
    res.render("monthlyReport",{
        layout:"main",
        data: dataContent
    });
});app.get("/attendanceReport",ensureLogin,(req,res)=>{
    res.render("attendanceReport",{
        layout:"main",
        data: dataContent
    });
});
app.get("/news",ensureLogin,(req,res)=>{
    res.render("news",{
        layout:"main",
        data: dataContent
    });
});
app.get("/logout",(req,res)=>{
    req.session.reset();
    res.render("viewTable");

});
app.listen(HTTP_PORT, onHttpStart);