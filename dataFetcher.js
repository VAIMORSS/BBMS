var fs = require('fs');

var person = [];
var departments = [];
var totalPerson = 0;

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile('./data/person.json', (err, data) => {
                if (err) throw err;
                person = JSON.parse(data);
                totalPerson = person.length;
            });
        } catch (ex) {
            reject("unable to read the files");
        }

        resolve("Successfully, connected to the file!!");
    });
}

///lets see is this working or not


module.exports.getAllPerson = () => {
    var allPerson = [];
    return new Promise((resolve, reject) => {
        for (var i = 0; i < totalPerson; i++) {
            allPerson.push(person[i]);
        }
        if (allPerson.length == 0) {
            reject("no record found");
        }
        resolve(allPerson);
    });
}

module.exports.addPerson = (personData) => {
    
    return new Promise((resolve, reject) => {
        person.push(personData);
        console.log("data added");
        if(person.length==0){
            reject("no record found");
        }
        for(var i=0;i<person.length;i++){
            console.log("from loop");
            console.log(person);
        }
        resolve(personData);
    });
}