const {Schema, model} = require('mongoose')

const Comment = new Schema({
    user:{type: Schema.Types.ObjectId, ref:'User'},
    created:{type:Date},
    title:{type:String, required:true},
    rating:{type:Number, default:0},
    postId:{type: Schema.Types.ObjectId, ref:'Post'}
})

module.exports = model('Comment', Comment)