var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const snippetSchema = new Schema({
    title : {
        type : String
    },
    body : {
        type : String
    },
    tags : {
        type : [String]
    },
    language: {
        type : String
    }

},{timestamps:true});
    

module.exports = mongoose.model('SnippetsV1',snippetSchema);