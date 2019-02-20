var mongoose = require("mongoose");
var Schema = mongoose.Schema;

let pass = encodeURIComponent("bbms@atlas");

let db = mongoose.createConnection(`mongodb://bbms:${pass}@cluster0-shard-00-00-enqlo.mongodb.net:27017,cluster0-shard-00-01-enqlo.mongodb.net:27017,cluster0-shard-00-02-enqlo.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`);



var attendance_list = new Schema({
    "username":{
        type:String,
        unique:true
    },"dateWiseAttendance":[{
        "date":{
            type:String,
            unique:true
        },
        "presentList":[{
            "personNum":Number
        }]
    }]
}); 

var attedanceAtDb = db.model("attendance_list", attendance_list);

module.exports.signup=(data)=>{

    let newAttendance = new attedanceAtDb({
        username:data
    });

    return new Promise((resolve, reject)=>{
        newAttendance.save((err)=>{
            if(err){
                reject(err,"error");
            }else{
                resolve("saved")
            }
         })
    });
}

module.exports.addAttendance =(req) =>{
    let d= new Date();
    let date = d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()+":"+d.getHours();

    let newAttendance = new attedanceAtDb({
        username:req.session.user.username,
        dateWiseAttendance:{
            date:date
        }
    });

    return new Promise((resolve, reject)=>{
                attedanceAtDb.findOne({username:req.session.user.username},{dateWiseAttendance:[{date:date}]},(err,result)=>{
                            if(err){
                                console.log(err);
                            }else{
                               attedanceAtDb.updateOne(
                                   {username:req.session.user.username},
                                   {dateWiseAttendance:{
                                       $push:{date:{$each:[date]}}
                                   }}
                               ,(err,result)=>{
                                    console.log(err,"   ",result);
                               });
                            }
                        });
           
    });
    
    // return new Promise((resolve, reject)=>{
    //     var tempUser=[];
    //     attedanceAtDb.findOne({username:req.session.user.username},{dateWiseAttendance:{date:date}},(err,result)=>{
    //         if(err){
    //             console.log(err);
    //         }else{
    //             console.log(result);
    //             result.dateWiseAttendance.presentList=req.body.data;
    //             console.log(result.dateWiseAttendance.presentList)
    //             tempUser=JSON.stringify(result);
    //         }
    //     });
    //     console.log(tempUser.username);
    //    // tempUser.dateWiseAttendance[0].presentList=JSON.parse(req.body.data);
    //     console.log(tempUser);
    // })
    
    
}



db.on('error',(err)=>{
    console.log("db err");
})

db.once('open',()=>{
    console.log("Mongodb is connected")
})


