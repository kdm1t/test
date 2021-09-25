const {Schema, model} = require('mongoose')

const Track = new Schema({
    user:{type: Schema.Types.ObjectId, ref:'User'},
    created:{type:Date},
    title:{type:String, required:true},
    url:{type:String},
    logo:{type:String},
    listen:{type:Number, default:0}
})

module.exports = model('Track', Track)