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


function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);

}

/***
 * Using client-session
 */

app.use(clientSession({
    cookieName: "session",
    secret: "bbmsbeta",
    duration: 60 * 60 * 1000,
    activeDuration: 1000 * 60
  }));

  const user = {
    username: '',
    password: ''
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
    for (var i = 0; i < contex.length; i++) {
        s += option.fn(this);
    }
    return s;
});

Handlebars.registerHelper('userInfo', function (contex, option) {
    var data=[];
    for(var i=0;i<contex.length;i++){
        data.push(contex[i]);
    }
    return data;
});


Handlebars.registerHelper('dataLength', function (contex, option) {
    return contex.length;
});

 //try to make this part in the client side server
 var i = 0;
Handlebars.registerHelper('repeter1', function (contex,option) {
    if (i >= contex.length) {
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

app.post("/signUp", (req, res) => {
    res.render("signup");
});

const Error = {"error":""};

app.post("/asignup", (req, res) => {

    dataFetcher.addUser(req.body).then(
        (data)=>{
            if(data==="1"){
                Error.error=" We are very sorry the username is taken please try other one ";
                res.render("signup",{
                    data:Error
                });
            }else{
                dataFetcher.authenticate(data.userName,data.password).then((data)=>{
                    if(data!=""){
                        {userLogIn=data;}
                        req.session.user={
                            username:data.username,
                            password:data.password
                        };

                        res.render("welcome",{
                            data:userLogIn[0],
                            layout:"main"
                        });
                    }});
            }
        }
    );

});
/******
 * ALL from submissions
 *
 */

app.post("/endpoint", (req, res) => {
    var json_data = JSON.parse(req.body.data);
    res.send("<p>lala</p>");
});

/********
 * person table definer
 */

 var personDefiner = function(req){
    dataFetcher.userDefiner(req.session.user.username);
 }

/********
 * Login
 */

var userLogIn={
    id:'1',
    firstName:'a',
    lastName:'a',
    userName:'a',
    password:'a',
    day:'a',
    createdAt:'a',
    updatedAt:'a'
}



app.post("/logIn", (req, res) => {

//trying to open the table which is connected to the user

dataFetcher.authenticate(req.body.userNameLn,req.body.passwordLn).then((data)=>{
        if(data!=""){
            {userLogIn=data[0];}
            req.session.user={
                username:userLogIn.userName,
                password:userLogIn.password
            };

            // res.render("welcome",{
            //     data:userLogIn[0],
            //     layout:"main"
            // });
            res.redirect('attendance');
        }else{
            res.redirect("/");
        }
    }).then(()=>{
        personDefiner(req);
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
        {add=req.body;}
    res.redirect("/addPerson");
}));
});

/********
 * User data registering, updating : DONE
 */

//////////////From Submission //////////////
app.get("/attendance",ensureLogin, (req, res) => {
    personDefiner(req);
    dataFetcher.getPersonAll(req).then((data)=>{
        var p = JSON.stringify(data);
        p = JSON.parse(p);
        res.render("attendanceView", {
        data: p,
        layout: "main"
        });
    });

});

app.get("/signUp", (req, res) => {

    res.render("signup", {
        layout: "main",
        data: userLogIn[0]
    });
});

app.get("/userList",ensureLogin, (req, res) => {
    personDefiner(req);
    dataFetcher.getPersonAll(req).then((data)=>{
        res.render("userList", {
            layout: "main",
            data:data
        });
    });
    
});


app.get("/addPerson",ensureLogin, (req, res) => {
    res.render("addPerson", {
        layout: "main"
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

//making the data accesable  in the datafetcher  via export module

module.exports.userInfo=()=>{
    return userLogIn;
}


/****
 * user list edit and delete
 */

 app.get("/userList/edit/:usrNum",(req,res)=>{
    personDefiner(req);
    dataFetcher.getPersonByNum(req.params.usrNum).then((data)=>{
        res.render("updatePerson", {
            layout: "main",
            data:data
        });
    })

 });

 app.get("/userList/remove/:usrNum",(req,res)=>{
    personDefiner(req);   
    console.log("remove function from the server.js called");
    dataFetcher.removeUserByNum(req.params.usrNum).then((data)=>{
        res.redirect("/attendance");
    });
 });


 app.post("/updatePerson",(req,res)=>{
    personDefiner(req);
    dataFetcher.updatePerson(req.body).then((data)=>{
        res.redirect("/attendance");
    })
 });

