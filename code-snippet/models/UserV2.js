var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SnippetsV1 = require('./SnippetsV1');

const userSchema = new Schema({
        username : {
            type : String,
            required : true,
            unique: true
        },
        email : {
            type : String,
            required: true,
            unique : true
        },
        password : {
            type : String,
            required : true
        },
        bookmark : [
            {
                type: Schema.Types.ObjectId,
                ref : "SnippetsV1"
            }

        ]
        
    
},{timestamps:true});


userSchema.pre('save', async function(next){
    if(this.password && this.isModified('password')){
        try{
            this.password = await bcrypt.hash(this.password,10);
            next();
        } catch {
            next(error);
        }    
    } else {
        next();
    }
    
});

userSchema.methods.verifyPassword = async function(password){
    try {
        const result = await bcrypt.compare(password,this.password);
        return result;
    } catch (error) {
        return error
    }
};

userSchema.methods.signToken = async function(){
    try {
        const payload = {
            email : this.email,
            id : this.id
        };
        const token = jwt.sign(payload, process.env.SECRET);
        return token;
    } catch (error) {
        return error;
    }
};


userSchema.methods.userJSON = async function(token = null){
    try {
        return {
            email : this.email,
            token : token,
            username : this.username,
            id : this.id,
            bookmark : this.bookmark
        }
    } catch (error) {
        return error;
    }
};

module.exports = mongoose.model('UserV2',userSchema);

