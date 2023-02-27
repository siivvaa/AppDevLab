const express = require("express")
const path = require("path")
var bodyParser = require('body-parser')

const mongoose = require("mongoose")
mongoose.set('strictQuery', false);

const userModel = require("./userDetails.js");

const app = express();  

app.set('views');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const dbURI = "mongodb+srv://<username>:<password>@<clusterName>.tgztkkl.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbURI, {useNewUrlParser : true, useUnifiedTopology : true})
    .then((result)=>{
        console.log("connected to DB");
        app.listen(3000);
    })
    .catch((err)=>{
         console.log("Error connecting to DB");
    });

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, '/home.html'));
})

app.post('/signup', (req,res)=>{
    uname = req.body.uname;
    password = req.body.pswd;
    age = req.body.age;
    email=req.body.email;
    userModel.find({uname: uname})
        .then((foundDetails)=>{
            if(foundDetails.length === 0){
                const details = new userModel({
                    uname: uname,
                    pass: password,
                    age: age,
                    email: email
                })
                details.save();
                console.log("New details saved!");
                res.redirect('/')
            }
            else{
                console.log("user already exists!")
                res.redirect('/');
            }
        })
})

app.post('/login', (req,res)=>{
    enteredUname = req.body.uname;
    enteredPass = req.body.pswd;
    userModel.findOne({uname: enteredUname})
        .then((detail)=>{
            if(detail.pass == enteredPass){
                res.render("details", {detail});
            }
            else{
                console.log("Wrong Details!");
                res.redirect('/');
            }
        })
        .catch((err)=>{
            console.log("User not found!")
        });
})