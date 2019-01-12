const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const Handlebars = require("handlebars");
const HTTP_PORT = process.env.PORT || 8080;
const fs = require("fs");
const dataFetcher = require("./dataFetcher.js");
const clientSession = require("client-sessions");
const name='person';

/****
 * 
 * Class variables 
 * 
 */

var newsNumber=0;

/****
 * 
 * Class variables 
 * 
 */






function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
     
}



/***
 * Using client-session 
 */
app.use(clientSession({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "bbmsbeta", 
    duration: 15 * 60 * 1000, 
    activeDuration: 1000 * 60 
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



/***
 * Done client-session 
 */

 app.use(bodyParser.urlencoded({
    extended: true
}));

app.engine(".hbs", exphbs({
    extname: ".hbs"
}));

app.use(express.static('public'));

/******
 * 
 * All the Handlebars and their helpers 
 * 
 * ************** */

Handlebars.registerHelper('repeter', function (contex, option) {
    var s = "";
    for (var i = 0; i < contex; i++) {
        s +=  option.fn(this) ;
    }
    return s;
});

var i = 0; //try to make this part in the client side server
Handlebars.registerHelper('repeter1', function (option) {
   // console.log("Helper called...");
    if (i >= userLogIn[0].number) {
        i = 0;
    }
    i++;
   
    return i;
});

Handlebars.registerHelper('cardMaker',function(contex,option){
     var cards=" ";
    
    console.log("CardMaker Helper called...");
    console.log(contex);
    console.log(Object.keys(contex).length);
    for(var i=0;i<Object.keys(contex).length;i++){
        console.log(contex[i].id);
        cards+="<div class=\"panel panel-default bootcards-media\">"+
               "<div class=\"panel-heading\">"+contex[i].head+"</div>"+
               "<div class=\"panel-body\">"+contex[i].main+"</div>"+
               "<div class=\"panel-body\">"+contex[i].footer+"</div>"+
               "</div>";
    }
    //cards+="</div>";
    return cards;
});

//helper to direct the request at the different part of the application

Handlebars.registerHelper('router', function (url, options) {
    return '<li ' + ((app.locals.activeRoute == url) ? 'class="active"' : '') + '> <a href="' + url + '">' + options.fn(this) + '</a></li>';
});

/******
 * 
 *  Handlebars Done 
 * 
 * ************** */

//for refreash
app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
})


app.set("view engine", ".hbs");



app.get("/", (req, res) => {
    res.render("viewTable");
});


/******
 * ALL from submissions 
 *
 */

app.post("/endpoint", (req, res) => {
    var json_data = JSON.parse(req.body.data);
    res.send("<p>lala</p>");
    console.log(req.body);
});


/********
 * Login 
 */

var userLogIn={
    id:'1',
    userName:'a',
    passWord:'a',
    firstName:'a',
    personNumber:'0',
    lastname:'a',
    personTable:'tbl'

}

app.post("/logIn", (req, res) => {
  
    
//trying to open the table which is connected to the user

dataFetcher.authenticate(req.body.userNameLn,req.body.passwordLn).then((data)=>{
    
        if(data!=""){
            {userLogIn=data;}
            req.session.user={
                username:user.username,
                password:user.password
            };
           
            res.render("welcome",{
                data:userLogIn[0],
                layout:"main"
            });  
            
            
        }else{
            res.redirect("/");
        }
       
        // var user= JSON.stringify(data);
        // user= JSON.parse(user);
        // console.log(user.id);
    });    
});
        




/********
 * Login Done 
 */

/********
 * User data registering, updating  
 */

var add = {
    firstName:'a',
    lastName:'a',
    school:'a',
    std:'1',
    firstyrpercentage:'1',
    unit:'a',
    society:'a',
    area:'a',
    city:'t',
    state:'a',
    stsngyr:'1',
    mdstsg:'N',
    dailypooja:'Y'
}

app.post("/addPerson",ensureLogin, (req, res) => {
   dataFetcher.addPerson(req.body).then((data => {
        console.log(req.body);
        {add=req.body;}
        console.log(add.city);
   
    res.redirect("/addPerson");
}));
});

/********
 * User data registering, updating : DONE
 */

//////////////From Submission //////////////
app.get("/attendance",ensureLogin, (req, res) => {
    res.render("attendanceView", {
        data: userLogIn[0],
        layout: "main"
    });

});

app.get("/signUp", (req, res) => {
    res.render("signup", {
        layout: "main",
        data: userLogIn[0]
    });
});
app.get("/addPerson",ensureLogin, (req, res) => {
    res.render("addPerson", {
        layout: "main",
        data: userLogIn[0]
    });
});

app.get("/monthlyReport",ensureLogin, (req, res) => {
    res.render("monthlyReport", {
        layout: "main",
        data: userLogIn[0]
    });
});
app.get("/attendanceReport",ensureLogin, (req, res) => {
    res.render("attendanceReport", {
        layout: "main",
        data: userLogIn[0]
    });
});




app.get("/news",ensureLogin, (req, res) => {
    dataFetcher.dailyNews(123).then(data=>{
        this.newsNumber=Object.keys(data).length;
        res.render("news", {
            layout: "main",
            data: data
        });
    })
    
});


app.get("/logout", (req, res) => {
    req.session.reset();
    res.render("viewTable");
});
app.listen(HTTP_PORT, onHttpStart);


