const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
bodyParser = require('body-parser');
const { auth } = require('express-openid-connect');// auth router attaches /login, /logout, and /callback routes to the baseURL
const {ObjectId} = require('mongodb');
const { requiresAuth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:8080',
  clientID: 'PN3eIv6YzRKLXtUxQcoXew8BHGGJo8jr',
  issuerBaseURL: 'https://dev-udjkxiqa.us.auth0.com'
};


const app = express();
const { Schema } = mongoose;
const port = 8080;

app.use(auth(config));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname + "/static")));

app.set('view engine', 'pug');

var em;

//GET Routes
app.get('/',  requiresAuth(),(req, res) => {
    
        res.send(req.oidc.isAuthenticated() ? res.redirect('/profile') : res.redirect('/login'))
   
    
});
app.get('/profile', requiresAuth(), (req, res) => {
  em = (JSON.stringify(req.oidc.user.email));
  em = em.slice(1,-1);
   
    res.redirect('/home');
});

const db = mongoose.connection;
//Establishing connection to database
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connection Successful....")
});

//Schema
const detailSchema = new Schema({
    name: String,
    business: String,
    email: String,
    phone: String,
    more: String
});
//creating instance of Schema
const info = mongoose.model('Info',detailSchema,'info');

//GET Routes
app.get('/home', function (req, res) {
   
    info.find({"email":em}).sort({$natural:-1})
    .exec(function (err, doc) {
          if (err) { return (err); }
         
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
     
    res.render('update',{'data':doc});

    }); 
   

})
// app.get('/logout',function(req,res){
//     res.redirect('/login')
// });

//POST Routes
app.post('/delete',function(req,res){
    res.render('delete')});

app.post('/home', function (req, res) {

       res.redirect('/data'); 
});

//update
app.post('/update/:id', function(req, res){

    id = req.params.id 
    info.findByIdAndUpdate({_id:Object(id)}, req.body, useFindAndModify= false,function(result, err){
            if(err){
                return (err);
            }
    })
    
    res.redirect('/home');
})
//add details
app.post('/data', function (req, res) {
    
   
    data1 = new info(req.body);
    data1.save(function(err,result){
        if(err) throw err;
        if(result){
    res.redirect("/home");
    
    }
   
    });

});
//delete
app.get('/delete/:id',function(req,res){
id = req.params.id;
console.log(id)
    info.deleteOne({_id:Object(id)},function(result, err){
        if(err)
        return err;
    })
    res.redirect('/home');
})
app.listen(port, function () {
    console.log(`Server started successfully on port ${port} ....`);
});





