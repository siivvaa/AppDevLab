const express = require("express")
const path = require("path")

const mongoose = require("mongoose")
mongoose.set('strictQuery', false);

const hitModel = require("./hitModel.js");
const { update } = require("./hitModel.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// view engine setup
app.set('views');
app.set('view engine', 'ejs');

const id = "63fc879ffe367b0823ab2a4e";

const dbURI = "mongodb+srv://<username>:<password>@<clusterName>.tgztkkl.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(dbURI, {useNewUrlParser : true, useUnifiedTopology : true})
    .then((result)=>{
        console.log("connected to DB");
        app.listen(8000);
    })
    .catch((err)=>{
         console.log("Error connecting to DB");
    });

app.get('/', (req,res)=>{
    hitModel.findById(id)
        .then((hitVal)=>{
            hitModel.findByIdAndUpdate(id, {hit: hitVal.hit+1}, {new: true})
                .then((hitVal)=>{
                    //console.log(updatedval);
                    res.render("home", {hitVal});
                    console.log("Logged!");
                });
        })
        .catch(()=>{
            hitVal = new hitModel({
                hit: 1
            })
            hitVal.save();
            res.render("home", {hitVal});
            console.log("Welcome to the site!");
        });
})
