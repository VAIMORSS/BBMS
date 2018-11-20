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

Handlebars.registerHelper('a',function(option){
   console.log("Helper called...");
   return '<strong>'+option.fn(this) + '</strong>';
});

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
app.set("view engine", ".hbs");

var data=fs.readFileSync("Json/data.json");
var dataContent = JSON.parse(data);

app.get("/", (req, res) => {
        res.render("viewTable");
});
app.post("/endpoint",(req,res)=>{
  console.log("lala");
  res.send("<p>lala</p>");
  console.log(req.body);
});

app.post("/logIn", (req, res) => {
   console.log(req.body.userNameLn);
   console.log(req.body.passwordLn);

   if((req.body.userNameLn).toString()=='a' ){
      
      res.render("attendanceView",{
         
           data : dataContent
       });
   }
});

app.post("/signUp",(req,res)=>{
    
    res.render("signup");
});

app.listen(HTTP_PORT, onHttpStart);