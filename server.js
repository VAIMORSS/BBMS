const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const equelize = require("sequelize");
const bodyParser = require("body-parser");
const path = require("path");
const Handlebars = require("handlebars");
const HTTP_PORT = process.env.PORT || 8080;
const fs = require("fs");4  
const dataFetcher = require("./dataFetcher.js");
const clientSession = require("client-sessions");

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
     
}

/***
 * Using client-session 
 */
app.use(clientSession({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "bbmsbeta", // this should be a long un-guessable string.
    duration: 15 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
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
    console.log("Helper called...");
    var s = "";
    for (var i = 0; i < contex; i++) {
        s += '<strong>' + option.fn(this) + '</strong>';
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
    
dataFetcher.authenticate(req.body.userNameLn,req.body.passwordLn).then((data)=>{
    
        if(data!=""){
            {userLogIn=data;}
            req.session.user={
                username:user.username,
                password:user.password
            };
           
           // console.log(userLogIn[0].firstName);
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
    std:'1'
}

app.post("/addPerson",ensureLogin, (req, res) => {
   // dataFetcher.addPerson(req.body).then((data => {
        console.log(req.body);
        {add:req.body;}
        console.log(add.firstName);
    //}));
    res.redirect("/addPerson");
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
    res.render("news", {
        layout: "main",
        data: userLogIn[0]
    });
});
app.get("/logout", (req, res) => {
    req.session.reset();
    res.render("viewTable");
});
app.listen(HTTP_PORT, onHttpStart);




/****TODO
 * 
 * 
 * Use session and cookie
 * 
 * 
 */