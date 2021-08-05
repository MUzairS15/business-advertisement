const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
bodyParser = require('body-parser');


// mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
//  const { Schema } = mongoose;

const app = express();
const port = 8080;
// const db = mongoose.connection;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname + "/static")));

app.set('view engine', 'pug');
// const detailSchema = new Schema({
//     name: String,
//     business: String,
//     email: String,
//     phone: String,
//     more: String
// });
// const info = mongoose.model('Info',detailSchema);

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log("Connection Successful....")
// });

app.get('/', function (req, res) {
    console.log("Hi");


    // info.find({},{_id:0}).sort({$natural:-1}).limit(1)
    // .exec(function (err, doc) {
    //       if (err) { return (err); }
         
    res.render('index', { 'data':[{"name":"Uzair", "phone":0998}] });

    // });
    
});

app.get('/data', function (req, res) {

    res.render('data')
})

app.get('/update',function(req,res){
    const id =  req.body.update;
    // console.log(id)
    res.render('update')

})
app.post('/delete',function(req,res){
    res.render('delete')});

app.post('/', function (req, res) {
     
     
       res.redirect('/data');
     
    });
app.post('/update', function(req, res){
    res.render('/');
})

app.post('/data', function (req, res) {
    
   
    data1 = new info(req.body);
    data1.save(function(err,result){
        if(err) throw err;
        if(result){
    res.redirect("/");
    console.log(req.body.name)
    }
    });

});

app.listen(port, function () {
    console.log(`Server started successfully on port ${port} ....`);
});





