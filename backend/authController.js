const User = require('./models/User')
const Role = require('./models/Role')
const Track = require('./models/Track')
const UserSettings = require('./models/UserSettings')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const {secret} = require('./config')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class authController {
//REGISTER
    async registration(req, res) {
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:"Ошибка при регистрации ", errors})
            }
            const {email, username, password} = req.body
            const checkMail = await User.findOne({email})
            if (checkMail){
                return res.status(400).json({message:"Пользователь с таким email уже существует"})
            }
            const checkUsername = await User.findOne({username})
            if (checkUsername){
                return res.status(400).json({message:"Такой username уже занят"})
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({value: 'USER'})
            const user = new User({username, password: hashPassword, email, roles: [userRole.value]})
            await user.save()
            return res.json({message:'Пользователь зарегистрирован'})

        } catch (e) {
            console.log(e)
            res.status(400).json({message:'registration error'})
        }
    }
//LOGIN
    async login(req, res) {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if (!user){
                return res.status(400).json({message:'Пользователь не найден'})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword){
                return res.status(400).json({message:'Введен неверный пароль'})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message:'login error'})
        }
    }
    async getUsers(req, res) {
        try{
            const users = await User.find()
            res.json(users)
        } catch (e) {

        }
    }

    async getUser(req, res) {
        try{
            const user = await User.findOne({ _id: req.user.id}).populate('settings', 'avatar')

            let avatar
            if(user.settings === null){
                avatar = ''
            }else{
                avatar = user.settings.avatar
            }

            res.status(200).json({
                user:{
                    username: user.username,
                    email: user.email,
                    id: user._id,
                    avatar: avatar,
                    roles: user.roles
                }
            })
        } catch (e) {
            res.status(400).json({message:'user cannot find'})
        }
    }

    async getUserPage(req, res) {
        try{
            const user = await User.findOne({ _id: req.query.id}).populate('settings')

            const tracks = await Track.find({user: req.query.id})

            res.json({
                user:{
                    username: user.username,
                    email: user.email,
                    roles: user.roles,
                    settings: user.settings,
                    tracks: tracks.length
                }
            })
        } catch (e) {
            res.status(400).json({message:'user cannot find'})
        }
    }

    async updateSettings(req,res){
        try{

            const {username, links, background, firstName, lastName, bio, city, country} = req.body

            const parseLinks = JSON.parse(links)
            console.log(parseLinks)

            const checkUser = await User.findOne({_id: req.user.id})

            if(!checkUser){
                return res.status(404).json({message:'user cannot find'})
            }

            if(checkUser.username !== username){
                const checkName = await User.findOne({username : username})
                if(checkName){
                    return res.status(400).json({message:'Такой username уже занят'})
                }
                await User.findOneAndUpdate({_id: req.user.id}, { username })
            }

            let imageLink = ""
            if(req.file){
                imageLink = "http://musicamp.std-263.ist.mospolytech.ru/" + req.file.path
            }

            if(checkUser.settings === null){

                const settings = new UserSettings({parseLinks, background, firstName, lastName, bio, city, country, avatar: imageLink})
                await settings.save()

                await User.findOneAndUpdate( {_id: req.user.id}, [{$set: { "settings" : settings._id }}])

                return res.json({message:'Настройки обновлены'})
            }

            const checkSettings = await UserSettings.findOne({_id: checkUser.settings})

            if(!checkSettings){
                res.status(404).json({message:'settings cannot find'})
            }

            const update = {
                background,
                firstName,
                lastName,
                bio,
                city,
                country,
                parseLinks,
                links : parseLinks
            }

            if(req.file){
                update.avatar = imageLink
            }

            await UserSettings.findOneAndUpdate({_id: checkUser.settings}, update)

            return res.json({message:'Настройки обновлены'})

        }catch (e) {
            res.status(400).json({message:'update settings error'})
        }
    }

    async getAuthors(req, res) {
        try{
            if(req.query.type === "randomUsers"){

                User.findRandom({}, {username : 1, _id : 1, roles: 1}, {limit: 3, populate: 'settings'}, function(err, result) {
                    if (!err) {
                        return res.json(result)
                    }
                });
            }
        } catch (e) {
            res.status(400).json({message:'user cannot find'})
        }
    }

}

module.exports = new authController()