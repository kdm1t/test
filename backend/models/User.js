const {Schema, model} = require('mongoose')
const random = require('mongoose-simple-random');

const User = new Schema({
    username:{type:String, unique:true, required:true},
    password:{type:String, required: true},
    email:{type:String, unique: true, required:true},
    roles:[{type:String, ref:'Role'}],
    follow:[{type: Schema.Types.ObjectId, ref:'User'}],
    settings:{type: Schema.Types.ObjectId, ref:'Settings', default: null}
})

User.plugin(random);

module.exports = model('User', User)