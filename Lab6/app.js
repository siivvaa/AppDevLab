const express = require("express")
const path = require("path")
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const mongo = require('mongodb').MongoClient;
const fs = require('fs');

//Importing Model.
const fileModel = require("./fileModel.js");

const app = express();  

//Some setting for mongoose idk.
mongoose.set('strictQuery', false);

//This is needed for parsing forms.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//For connecting to DB.
const dbURI = "mongodb://127.0.0.1:27017/Lab6";

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

app.get('/view', (req,res)=>{
    res.sendFile(path.join(__dirname, '/view.html'));
})

app.get('/enter', (req,res)=>{
    res.sendFile(path.join(__dirname, '/forms.html'));
})

app.post('/enterInfo', function (req, res) {

    const userDetails = {
        name: req.body.uname,
        age: req.body.age,
        email: req.body.email,
        pass: req.body.pass
    };
    fileModel.findOne({name: userDetails.name})
                .then((data)=>{
                    if(data!=null)
                    {
                        console.log("User already exists in database!");
                        res.redirect('/');
                    }
                    else
                    {
                        const data = "Name - " + userDetails.name + "\nEmail - "+userDetails.email+"\nAge - "+userDetails.age;
                        fs.writeFile(userDetails.name+".docx", data, function(err) {
                        if(err)
                            return console.log(err);
                        else
                        {
                            //console.log("Data written in enteredData folder!");
                            const detailsFile = fs.readFileSync(userDetails.name+".docx");
                            const fileDetails = new fileModel({
                                name: userDetails.name,
                                password: userDetails.pass,
                                details: detailsFile
                            });
                            fileDetails.save()
                                .then(err => {
                                    console.log("File saved in database!");
                                    const filePath = userDetails.name+".docx";
                                    fs.unlinkSync(filePath);
                                    res.redirect('/');
                                })
                                .catch(()=>{
                                    console.log("Error in saving data!");
                                });
                        }
                        }); 
                    }
                });
});
//Have to do password authentication.
app.post('/viewInfo', (req,res)=>{
    const uname = req.body.uname;
    const enteredPass = req.body.pass;
    fileModel.findOne({name: uname})
        .then(data => {
            if(data!=null)
            {
                if(data.password === enteredPass)
                {
                    //console.log(data);
                    fs.writeFile("./fetchedData/" + uname + ".pdf", data.details, function(err){
                        if (err) 
                            throw err;
                        else
                        {
                            console.log("Fetched user details and stored it in fetchedData folder!");
                            res.redirect('/');
                        }
                    });
                }
                else
                {
                    console.log("Incorrect Credentials!");
                    res.redirect('/');
                }
            }
            else
            {
                console.log("User doesn't exist!");
                res.redirect('/');
            }
    });
});