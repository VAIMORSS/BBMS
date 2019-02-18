var mongoose = require("mongoose");
var Schema = mongoose.Schema;

let pass = encodeURIComponent("bbms@atlas");

let db = mongoose.createConnection(`mongodb://bbms:${pass}@cluster0-shard-00-00-enqlo.mongodb.net:27017,cluster0-shard-00-01-enqlo.mongodb.net:27017,cluster0-shard-00-02-enqlo.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`);



var attendance_list = new Schema({
    "username":{
        type:String,
        unique:true
    },"dateWiseAttendance":[{
        "date":String,
        "presentList":[{
            "personNum":Number
        }]
    }]
}); 

var attedanceAtDb = db.model("attendance_list", attendance_list);

module.exports.addAttendance =(req) =>{
    let d= new Date();
    let date = d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()+":"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
   
    var newAttendance = new attedanceAtDb({
        username:req.session.user.username,
        dateWiseAttendance:{
            date:date
        }
    });

    return new Promise((resolve, reject)=>{
        newAttendance.save((err)=>{
            if(err){
                reject("error >>>>>>>>>>>>>>>>>");
            }else{
                resolve("saved :):)::::::::::::::::::)))))))))))))))))))")
            }
        })

        
    })
    
    
}



db.on('error',(err)=>{
    console.log("db err");
})

db.once('open',()=>{
    console.log("Mongodb is connected")
})


