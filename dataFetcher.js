var fs = require('fs');
var sequelize = require('sequelize');

var Sequelize = new sequelize('d558e7l0prgtpo', 'bhttoyjbvistmo', '24f9a4f901a9929509d983b24197af50a9240d2ceb62eb6eb91aa6beb656c425', {
    host: 'ec2-23-21-147-71.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: '5432',
    dialectOptions: {
        ssl: true
    }
});

Sequelize.authenticate.then(() => {
    console.log("Database conncted successfully!!!");
}).catch((err) => {
    console.log(err);
});

const Person = Sequelize.define('Person', {
    PersonNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    std: Sequelize.INTEGER,
    school: Sequelize.STRING
}, {
        updatedAt: false
    });


var person = [];
var departments = [];
var totalPerson = 0;

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
            Sequelize.sync().then((Person) => {
                resolve();
            }).catch((err) => {
                reject("unable to read the files");
            });
    });
}

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
        if (person.length == 0) {
            reject("no record found");
        }
        for (var i = 0; i < person.length; i++) {
            console.log("from loop");
            console.log(person);
        }
        resolve(personData);
    });
}