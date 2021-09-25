const {Schema, model} = require('mongoose')

const Settings = new Schema({
    links:{type: Array, default: []},
    avatar:{type: String},
    background: {type: Number},
    firstName: {type: String},
    lastName: {type: String},
    bio: {type: String},
    city: {type: String},
    country: {type: String}
})

module.exports = model('Settings', Settings)