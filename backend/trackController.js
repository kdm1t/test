const Post = require('./models/Post')
const User = require('./models/User')
const Track = require('./models/Track')
const Album = require('./models/Album')
const UserPost = require('./models/UserPost')
const {validationResult} = require('express-validator')

class trackController {

    async trackUpload(req, res) {
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:"Ошибка при создании поста", errors})
            }

            const {title} = req.body

            const checkUser = await User.findOne({ _id: req.user.id})
            if(!checkUser){
                return res.status(404).json({message:'Пользователь не найден'})
            }

            const audioLink = "http://musicamp.std-263.ist.mospolytech.ru/" + req.files.url[0].path

            let imageLink = ""
            if(req.files.logo){
                imageLink = "http://musicamp.std-263.ist.mospolytech.ru/" + req.files.logo[0].path
            }

            const date = new Date()
            const createTrack = new Track({user: checkUser, created: date, title, listen : 0, url: audioLink, logo: imageLink})
            await createTrack.save()

            return res.json({message:'Аудиозапись опубликована'})

        } catch (e) {
            res.status(400).json({message:'upload error'})
        }
    }

    async getUserTracks(req, res) {
        try{

            let tracks = []

            if(req.query.type === "history"){
                const arr = JSON.parse(req.query.arr)

                for(const item of arr) {
                    const find = await Track.findOne({_id: item}).populate('user', 'username _id')
                    tracks.push(find)
                }

                return res.json(tracks)
            }

            if(req.query.type === "userPage"){
                tracks = await Track.find({user: req.query.id}).populate('user', 'username _id')

                if(tracks){
                    return res.json(tracks)
                }

                return res.status(404).json({message:'tracks cannot find'})
            }else{
                tracks = await Track.find({user: req.query.id}).populate('user', 'username _id')

                if(tracks.length > 0){
                    return res.json(tracks)
                }

                tracks = await Track.find({_id: req.query.id}).populate('user', 'username _id')

                if(tracks.length > 0){
                    return res.json(tracks)
                }

                tracks = await Album.findOne({_id: req.query.id})
                    .populate('user', 'username _id')
                    .populate({path : 'tracks', select : 'listen user title url logo', populate: { path : 'user',select : 'username _id'} })

                if(tracks){
                    return res.json(tracks.tracks)
                }

                return res.status(404).json({message:'tracks cannot find'})
            }

        } catch (e) {
            res.status(400).json({message:'posts cannot find'})
            console.log(e)
        }
    }

    async getOneTrack(req, res) {
        try{

            const track = await Track.find({_id: req.query.id}).populate('user', 'username _id')

            res.json(track)

        } catch (e) {
            res.status(400).json({message:'posts cannot find'})
            console.log(e)
        }
    }

    async albumUpload(req, res) {
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:"Ошибка при создании альбома", errors})
            }

            const {title, tracks, duration} = req.body

            const checkUser = await User.findOne({ _id: req.user.id})
            if(!checkUser){
                return res.status(400).json({message:'Пользователь не найден'})
            }

            let imageLink = ""
            if(req.files.logo){
                imageLink = "http://musicamp.std-263.ist.mospolytech.ru/" + req.files.logo[0].path
            }

            const date = new Date()
            const createAlbum = new Album({user: checkUser, created: date, title, logo: imageLink, tracks, duration})

            await createAlbum.save()
            return res.json({message:'Альбом опубликован'})

        } catch (e) {
            res.status(400).json({message:'upload error'})
        }
    }

    async getAlbum(req, res) {
        try{

            let albums

            if(req.query.type === "randomAlbum"){

                Album.findRandom({}, {}, {limit: 2}, function(err, result) {
                    if (!err) {
                        return res.json(result)
                    }
                })
                return
            }

            if (req.query.type === "album"){
                albums = await Album.findOne({_id: req.query.id})
                    .populate('user', 'username _id')
                    .populate({path : 'tracks', select : 'listen user title url logo', populate: { path : 'user',select : 'username _id'} })

                if(!albums){
                    return res.json({message:'album cannot find'})
                }

                return res.json(albums)
            }

            albums = await Album.find({user: req.query.id})
                .populate('user', 'username _id')
                .populate({path : 'tracks', select : 'listen user title url logo', populate: { path : 'user',select : 'username _id'} })

            if(!albums){
                return res.json({message:'album cannot find'})
            }

            res.json(albums)

        } catch (e) {
            res.status(400).json({message:'album cannot find'})
            console.log(e)
        }
    }

    async deleteTrack(req,res){
        try{

            if( req.body.type === "Track"){
                const track = await Track.findOne({ _id: req.body.id})

                if(!track){
                    return res.status(400).json({message:'Трек не найден'})
                }

                const user = await User.findOne({ _id: req.user.id})

                if (!user){
                    return res.status(400).json({message:'Пользователь не найден'})
                }

                if(user.roles.includes("ADMIN")){
                    await Track.findByIdAndDelete(track.id)
                    return res.json({message:'Трек удален'})
                }

                if (user.id === track.user){
                    await Track.findByIdAndDelete(track.id)
                    return res.json({message:'Трек удален'})
                }

                res.status(400).json({message:'cannot delete'})
            }

            if( req.body.type === "Album"){
                const album = await Album.findOne({ _id: req.body.id})

                if(!album){
                    return res.status(400).json({message:'Трек не найден'})
                }

                const user = await User.findOne({ _id: req.user.id})

                if (!user){
                    return res.status(400).json({message:'Пользователь не найден'})
                }

                if(user.roles.includes("ADMIN")){
                    await Album.findByIdAndDelete(album.id)
                    return res.json({message:'Альбом удален'})
                }

                if (user.id === album.user){
                    await Album.findByIdAndDelete(album.id)
                    return res.json({message:'Альбом удален'})
                }

                res.status(400).json({message:'cannot delete'})
            }

        }catch (e) {
            res.status(400).json({message:'track cannot find'})
            console.log(e)
        }
    }

}

module.exports = new trackController()