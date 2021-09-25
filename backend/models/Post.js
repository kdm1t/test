const {Schema, model} = require('mongoose')

const Post = new Schema({
    user:{type: Schema.Types.ObjectId, ref:'User'},
    created:{type:Date},
    title:{type:String, required:true},
    description:{type:String},
    views:{type:Number, default:0},
    rating:{type:Number, default:0},
    tags:{type:Array},
    comments:{type:Array},
    votes:{type:Array, ref:'Vote'},
    images:{type:Object},
    tracks:[{type: Schema.Types.ObjectId, ref:'Track'}]
})

module.exports = model('Post', Post)