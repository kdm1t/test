const {Schema, model} = require('mongoose')
const random = require('mongoose-simple-random');

const Album = new Schema({
    user:{type: Schema.Types.ObjectId, ref:'User'},
    created:{type:Date},
    title:{type:String, required:true},
    tracks:[{type: Schema.Types.ObjectId, ref:'Track'}],
    logo:{type:String},
    duration:{type:Number}
})

Album.plugin(random)

module.exports = model('Album', Album)