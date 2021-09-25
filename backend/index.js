const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')
const postRouter = require('./postRouter')
const trackRouter = require('./trackRouter')
const bodyParser = require('body-parser')
const cors = require('cors')
const PORT = process.env.PORT || 5000

mongoose.set('useFindAndModify', false);
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false}))
app.use('/uploads/images', express.static('uploads/images'));
app.use('/uploads/tracks', express.static('uploads/tracks'));
app.use("/auth", authRouter)
app.use("/upload", postRouter)
app.use("/music", trackRouter)

const start = async () => {
    try{
        await mongoose.connect(`mongodb://ConnorThe1:13579246800Zz@cluster0-shard-00-00.1ikmq.mongodb.net:27017,cluster0-shard-00-01.1ikmq.mongodb.net:27017,cluster0-shard-00-02.1ikmq.mongodb.net:27017/musicamp?ssl=true&replicaSet=atlas-fgl1ng-shard-0&authSource=admin&retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true })
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()