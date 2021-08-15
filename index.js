const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
bodyParser = require('body-parser');


mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
 const { Schema } = mongoose;
const {ObjectId} = require('mongodb');
  const app = express();
const port = 8080;
const db = mongoose.connection;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname + "/static")));

app.set('view engine', 'pug');
const detailSchema = new Schema({
    name: String,
    business: String,
    email: String,
    phone: String,
    more: String
});
const info = mongoose.model('Info',detailSchema,'info');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connection Successful....")
});

app.get('/', function (req, res) {
    console.log("Hi");


    info.find({}).sort({$natural:-1})
    .exec(function (err, doc) {
          if (err) { return (err); }
        //  console.log(doc._id);
    res.render('index', { 'data':doc });

    });
    
});

app.get('/data', function (req, res) {

    res.render('data')
})

app.get('/update/:id',function(req,res){
    const id =  req.params.id;
    _id = ObjectId(id);
    info.findById(_id)
    .exec(function (err, doc) {
          if (err) { return (err); }
        //  console.log(doc.name);
    res.render('update',{'data':doc});

    }); 
    // console.log(id)

})
app.post('/delete',function(req,res){
    res.render('delete')});

app.post('/', function (req, res) {
     
     
       res.redirect('/data');
     
    });
app.post('/update/:id', function(req, res){

    id = req.params.id 
    info.findByIdAndUpdate({_id:Object(id)}, req.body, useFindAndModify= false,function(result, err){
            if(err){
                return (err);
            }
    })
    
    res.redirect('/');
})

app.post('/data', function (req, res) {
    
   
    data1 = new info(req.body);
    data1.save(function(err,result){
        if(err) throw err;
        if(result){
    res.redirect("/");
    
    }
    // console.log(data1.id)
    });

});
app.get('/delete/:id',function(req,res){
id = req.params.id;
console.log(id)
    info.deleteOne({_id:Object(id)},function(result, err){
        if(err)
        return err;
    })
    res.redirect('/');
})
app.listen(port, function () {
    console.log(`Server started successfully on port ${port} ....`);
});





