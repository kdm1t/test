const Post = require('./models/Post')
const Comment = require('./models/Comment')
const User = require('./models/User')
const UserPost = require('./models/UserPost')
const {validationResult} = require('express-validator')

class postController {

    async postUpload(req, res) {
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:"Ошибка при создании поста", errors})
            }

            const {title, description, post_type, privacy, tags, comments, tracks} = req.body

            const checkUser = await User.findOne({ _id: req.user.id})
            if(!checkUser){
                return res.status(400).json({message:'Пользователь не найден'})
            }

            let imageLink = ""
            if(req.file){
                imageLink = "http://musicamp.std-263.ist.mospolytech.ru/" + req.file.path
            }

            const date = new Date()
            const createPost = new Post({user: checkUser, created: date, title, description, views : 0, rating : 0, post_type, privacy, tags, comments, images: imageLink, tracks : tracks})
            await createPost.save()
            return res.json({message:'Пост опубликован'})

        } catch (e) {
            res.status(400).json({message:'upload error'})
        }
    }

    async getPosts(req, res) {
        try{
            let {page = 1, limit = 5} = req.query

            const posts = await Post.find()
                .limit(limit *1).skip((page - 1)*limit)
                .populate({path : 'user', select : 'username _id roles', populate: { path : 'settings',select : 'avatar'} })
                .sort({'created': -1})
                .populate('tracks')


            for (const post of posts) {
                const commentf = await Comment.find({postId: post.id})
                    .populate({path : 'user', select : 'username _id roles', populate: { path : 'settings',select : 'avatar'} })
                post.comments = commentf
            }

            res.json(posts)

        } catch (e) {
            res.status(400).json({message:'posts cannot find'})
            console.log(e)
        }
    }

    async commentUpload(req, res) {
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:"Ошибка при создании поста", errors})
            }

            const {title, postId} = req.body

            const checkPost = await Post.findOne({ _id: req.body.postId})
            if(!checkPost){
                const checkUserPost = await UserPost.findOne({ _id: req.body.postId})
                if(!checkUserPost){
                    return res.status(400).json({message:'Пост не найден'})
                }
            }

            const checkUser = await User.findOne({ _id: req.user.id})
            if(!checkUser){
                return res.status(400).json({message:'Пользователь не найден'})
            }

            const createComment = new Comment({user: checkUser, created: new Date(), title, rating : 0, postId})

            // await Post.findByIdAndUpdate(checkPost, {comments: createComment._id})

            await createComment.save()

            const commentRes =  await Comment.find({ postId: req.body.postId})
                .populate({path : 'user', select : 'username _id roles', populate: { path : 'settings',select : 'avatar'} })

            return res.json({message:'Комментарий опубликован', comments: commentRes})

        } catch (e) {
            res.status(400).json({message:'upload error'})
        }
    }

    async postUpdate(req, res) {
        try {

            const {data} = req.body

            if( !(req.body.vote <= 1 && req.body.vote >= -1) ){
                return res.json({message:'Не шали'})
            }

            const checkPost = await Post.findOne({_id : req.body.postId})

            let voteF = await checkPost.votes.findIndex(vote => vote.user === req.user.id)

            if(voteF >= 0){
                if(req.body.vote == 0) {
                    await Post.findByIdAndUpdate({_id: req.body.postId, "votes.user": req.user.id}, { $pull: { votes: { user: req.user.id }}})
                    const s = await Post.findOne({_id : req.body.postId})
                    return res.json({message: 'Оценка обновлена', votes: s.votes})
                }else{
                    await Post.findOneAndUpdate({_id: req.body.postId, "votes.user": req.user.id}, {$set: { "votes.$.vote": req.body.vote}})
                    const s = await Post.findOne({_id : req.body.postId})
                    return res.json({message: 'Оценка обновлена', votes: s.votes})
                }
            }


            const vote = {
                vote: req.body.vote,
                user: req.user.id
            }

            await Post.findByIdAndUpdate(req.body.postId ,{$push: {votes : vote}})
            const s = await Post.findOne({_id : req.body.postId})


            return res.json({message: 'Оценка обновлена', votes: s.votes})

        } catch (e) {
            console.log(e)
            res.status(400).json({message:'login error'})
        }
    }

    async postDelete(req, res) {
        try{

            let checkPost = await Post.findOne({ _id: req.body.postId})

            let postType = true

            if(!checkPost){
                checkPost = await UserPost.findOne({ _id: req.body.postId})
                if(!checkPost){
                    return res.status(400).json({message:'Пост не найден'})
                }
                postType = false
            }

            const checkUser = await User.findOne({ _id: req.user.id})
            if(!checkUser){
                return res.status(400).json({message:'Пользователь не найден'})
            }

            if( checkUser.roles.includes("ADMIN") || toString(checkUser._id) === toString(checkPost.user) ){
                if(postType){
                    await Post.findByIdAndDelete(checkPost._id)
                    await Comment.deleteMany({postId: checkPost._id})
                    return res.json({message:'Пост удален'})
                }
                await UserPost.findByIdAndDelete(checkPost._id)
                await Comment.deleteMany({postId: checkPost._id})
                return res.json({message:'Пост удален'})
            }

        } catch (e) {
            res.status(400).json({message:'upload error'})
        }
    }

    //USER POSTS

    async userPostUpload(req, res) {
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:"Ошибка при создании поста", errors})
            }

            const {title, description, privacy, comments, tracks} = req.body

            const checkUser = await User.findOne({ _id: req.user.id})
            if(!checkUser){
                return res.status(400).json({message:'Пользователь не найден'})
            }

            let imageLink = ""
            if(req.file){
                imageLink = "http://musicamp.std-263.ist.mospolytech.ru/" + req.file.path
            }

            const date = new Date()
            const createPost = new UserPost({user: checkUser, created: date, title, description, views : 0, rating : 0, privacy, comments, images: imageLink, tracks: tracks})
            await createPost.save()
            return res.json({message:'Пост опубликован'})

        } catch (e) {
            res.status(400).json({message:'upload error'})
        }
    }

    async getUserPosts(req, res) {
        try{
            let {page = 1, limit = 5} = req.query

            const posts = await UserPost.find({user: req.query.id})

                .limit(limit *1).skip((page - 1)*limit)
                .populate({path : 'user', select : 'username _id roles', populate: { path : 'settings',select : 'avatar'} })
                .sort({'created': -1})
                .populate('tracks')


            for (const post of posts) {
                const commentf = await Comment.find({postId: post.id})
                    .populate({path : 'user', select : 'username _id roles', populate: { path : 'settings',select : 'avatar'} })
                post.comments = commentf
            }

            res.json(posts)

        } catch (e) {
            res.status(400).json({message:'posts cannot find'})
            console.log(e)
        }
    }

}

module.exports = new postController()