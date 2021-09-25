const Router = require('express')
const router = new Router()
const controller = require('./postController')
const multer  = require('multer')
const {check} = require('express-validator')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './uploads/images/')
    },
    filename(req, file, cb) {
        cb(null,  "musicamp-" + Date.now() + ".jpg")
    }
})

const fileFilter = (req, file, cb) => {

        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true)
        } else {
            cb(null, false)
        }

}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 3
    },
    fileFilter: fileFilter
})

router.post('/postUpload',
    upload.single('image'),
    [check('title', "Заголовок не может быть пустым").notEmpty()],
    authMiddleware, controller.postUpload)

router.get('/posts', controller.getPosts)

router.post('/commentUpload', [
    check('title', "Комментарий не может быть пустым").notEmpty(),
    check('postId', "Комментарий должен быть прикреплен").notEmpty()
], authMiddleware, controller.commentUpload)

router.post('/postUpdate', authMiddleware, controller.postUpdate)

router.post('/postDelete', check('postId', "Пост не найден").notEmpty(), authMiddleware, controller.postDelete)

// router.post('/userPostDelete', check('postId', "Пост не найден").notEmpty(), authMiddleware, controller.userPostDelete)

router.post('/userPostUpload',
    upload.single('image'),
    [check('title', "Заголовок не может быть пустым").notEmpty()],
    authMiddleware, controller.userPostUpload)

router.get('/userPosts', controller.getUserPosts)

module.exports  = router
