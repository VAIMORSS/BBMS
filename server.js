const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const Sequelize = require("sequelize");
const bodyParser = require("body-parser");
const path = require("path");
const Handlebars = require("handlebars");
const HTTP_PORT = process.env.PORT || 8080;
const  fs = require("fs");

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}   

app.use(bodyParser.urlencoded({ extended: true }));
app.engine(".hbs", exphbs({ extname: ".hbs" }));


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
    
    return '<li'+((app.locals.activeRoute==url)?'class="active"':'')+'> <a href="'+url+'">'+ options.fn(this)+'</a></li>';
    
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



app.post("/endpoint",(req, res)=>{
  console.log("lala");
  console.log(req.body.data);
  var json_data = JSON.parse(req.body.data);
//we are getting the string of the people who are presented now we just have to make sure that at a time more than one people can access this system 

  res.send("lala");
});


app.post("/logIn", (req, res) => {
   console.log(req.body.userNameLn);
   console.log(req.body.passwordLn);

   if((req.body.userNameLn).toString()=='a' ){
    res.render("main");
      
   }
});
app.get("/attendance",(req,res)=>{
    res.render("attendanceView",{
        data: dataContent    
    });
    
});
    
app.post("/signUp",(req,res)=>{
    
    res.render("signup");
});

app.listen(HTTP_PORT, onHttpStart);