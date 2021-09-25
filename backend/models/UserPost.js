const {Schema, model} = require('mongoose')

const UserPost = new Schema({
    user:{type: Schema.Types.ObjectId, ref:'User'},
    created:{type:Date},
    title:{type:String, required:true},
    description:{type:String},
    rating:{type:Number, default:0},
    privacy:{type:Number, default:0},
    comments:{type:Array},
    images:{type:Object},
    tracks:[{type: Schema.Types.ObjectId, ref:'Track'}]
})

module.exports = model('UserPost', UserPost)





