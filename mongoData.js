var mongoose = require("mongoose");
var Schema = mongoose.Schema;

let pass = encodeURIComponent("bbms@atlas");

let db = mongoose.createConnection(`mongodb://bbms:${pass}@cluster0-shard-00-00-enqlo.mongodb.net:27017,cluster0-shard-00-01-enqlo.mongodb.net:27017,cluster0-shard-00-02-enqlo.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`);



var attendance_list = new Schema({
    "username":{
        type:String,
        unique:true
    },"datewise":{
        type:Array,
        "date":String,
        "personList":Array
        
    }
}); 

var attedanceAtDb = db.model("attendance_list", attendance_list);

module.exports.signup=(data)=>{


    let newAttendance = new attedanceAtDb({
        username:data
    });
    newAttendance.save((err)=>{
    return new Promise((resolve, reject)=>{
        
            if(err){
                reject(err,"error");
            }else{
                resolve("saved")
            }
         })
    });
}

module.exports.addAttendanceDate =(req) =>{
    let d= new Date();
    let date = d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()+":"+d.getHours()+":"+d.getMinutes();

    let newAttendance = new attedanceAtDb({
        username:req.session.user.username
    });

    return new Promise((resolve, reject)=>{
                //upsrt option ne and push
         newAttendance.save((err,result)=>{
             if(err){
                 reject(err);
             }else{
                 resolve(result);
             }
         })
 
    });  
}

module.exports.addAttendance = (req) =>{
    let d= new Date();
    let date = d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();

    return new Promise((resolve, reject)=>{
        //upsrt option ne and push
        attedanceAtDb.update({
                    "username":req.session.user.username},{
                    $addToSet:{
                        "datewise":{
                            "date":date,
                            "personList":req.body.data                       
                    }}
            },{upsert:false}
        //date is added but now need to add
        ,(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
});
}

db.on('error',(err)=>{
    console.log("db err");
})

db.once('open',()=>{
    console.log("Mongodb is connected")
})


