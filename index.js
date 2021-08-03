const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
const { Schema } = mongoose;
const fs = require('fs');
const app = express();
const port = 8080;
const db = mongoose.connection;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname + "/static")));
// app.use(express.static(path.join(__dirname + "./static/data.html")));
app.set('view engine', 'pug');
const detailSchema = new Schema({
    name: String,
    business: String,
    email: String,
    phone: String,
    more: String
});
const info = mongoose.model('Info',detailSchema);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connection Successful....")
});

app.get('/',function(req,res){
    // console.log("Hi");
   
    info.find({},{_id:0}).sort({$natural:-1}).limit(1)
    .exec(function (err, doc) {
          if (err) { return (err); }
          //Successful, so render
        //  console.log(doc)
        //  console.log(doc[0].name)
        res.render('index', {'data':doc});
      
    });
    // }else{
    //     res.render('index');
    // }
    //    res.render('data',{ title: 'Local Library Home',  data: doc });
   
   
    // res.render('index',{ title: 'Local Library Home', data: data });
   
});
 

app.post('/',function(req,res){
    
    res.redirect("/data");
    
 
});
app.get('/data',function(req,res){
   
    res.render('data')
})

app.post('/data',function(req,res){
    console.log("S");
 
    data1 = new info(req.body);
    data1.save(function(err,result){
        if(err) throw err;
        if(result){
            // show();
            res.redirect("/");
               
             
        }
    });

});

// async function show(){
    
//     doc = await dat2.exec()
//     // if(!doc){

//         console.log(doc)
//         return doc;
    // }
    // else {
        // console.log("EMPTY~~~~");
        // return false;
    // }
    
  

   
   
       
         
    
  
   


app.listen(port,function(){
    console.log(`Server started successfully on port ${port} ....`);
});





