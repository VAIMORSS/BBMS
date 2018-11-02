const express = require("express");
const app= express();
const path = require("path");

const port = process.env.PORT || 8080;

function onHttpStart(){
    console.log("Waiting for the response form the client from port 8080");
}

app.use(express.static("./htmls/"));

app.get("/",(req,res)=> {
    res.sendFile(path.join(__dirname,"/htmls/numberTaker.html"));
});

app.listen(port, onHttpStart);
