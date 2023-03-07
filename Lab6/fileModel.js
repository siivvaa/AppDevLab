const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    name: String,
    password: String,
    details: Buffer
});

const fileModel = mongoose.model('file', fileSchema);
//userDetail must be SINGULAR!!
module.exports = fileModel;
