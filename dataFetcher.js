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

    Sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    }).catch((err) => {
        console.log('Unable to connect to the database:', err);
    });

    const Person = Sequelize.define('Person', {
        PersonNum: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
            firstName: sequelize.STRING,
            lastName: sequelize.STRING,
            std: sequelize.INTEGER,
            school: sequelize.STRING
        }, {
            updatedAt: false
        });

    const LogInTbl = Sequelize.define('LogInTbl', {
        id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userName: sequelize.STRING,
        password: sequelize.STRING
        }, {
        updatedAt: false
        });

var person = [];
var departments = [];
var totalPerson = 0;



module.exports.authenticate=(username,Password)=>{
    return new Promise((resolve, reject) => {
        
        Sequelize.sync().then(()=>{
            resolve(LogInTbl.findAll({
                where:{
                    userName:username,
                    password:Password
                },
                raw:true
            }))
        });
    });
}
module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
            Sequelize.sync().then((Person) => {
                resolve("Synced successfully!!");
            }).catch((err) => {
                reject("unable to read the files");
            });
    });
}

module.exports.getPersonByNum = (num) => {
    var allPerson = [];
    return new Promise((resolve, reject) => {
        Sequelize.sync().then(()=>{
            resolve(Person.findAll({
                where:{
                    PersonNum:num
                }
            }))
        });
        resolve(allPerson);
    });
}

module.exports.getPersonAll = (num) => {
    var allPerson = [];
    return new Promise((resolve, reject) => {
        Sequelize.sync().then(()=>{
            resolve(Person.findAll());
        }).catch((err)=>{
            reject(err);
        });
        resolve(allPerson);
    });
}

module.exports.updatePerson = (personData) => {
    return new Promise((resolve, reject) => {
       Sequelize.sync().then(()=>{
                
        for(let x in personData){
            if(personData[x]==""){
                personData[x]=null;
            }
        }

        resolve(Person.update({
            firstName:personData.firstName,
            lastName:personData.lastName,
            std:personData.std,
            school:personData.school

        },{where :{
            PersonNum:personData.PersonNum
        }}).catch((err)=>{
            reject(err);
        }));
        
       }).catch((err)=>{
           reject(err);
       });  
      });
}



module.exports.addPerson = (personData) => {
    return new Promise((resolve, reject) => {
       Sequelize.sync().then(()=>{
                
        for(let x in personData){
            if(personData[x]==""){
                personData[x]=null;
            }
        }

        resolve(Person.create({
            firstName:personData.firstName,
            lastName:personData.lastName,
            std:personData.std,
            school:personData.school

        }).catch((err)=>{
            reject(err);
        }));
        
       }).catch((err)=>{
           reject(err);
       });  
      });
}