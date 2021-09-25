const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {check} = require('express-validator')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')
const multer  = require('multer')

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

router.post('/registration', [
    check('username', "Имя пользователя не может быть пустым").notEmpty().trim(),
    check('password', "Минимальная длина пароля 6 символов").isLength({min:6}),
    check('email', "Введите корректный email").isEmail().normalizeEmail()
    ], controller.registration)
router.post('/login', controller.login)
router.get('/user', authMiddleware, controller.getUser)
router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers)

router.get('/getAuthors', controller.getAuthors)

router.get('/userPage',  controller.getUserPage)

router.post('/updateSettings',upload.single('image'), authMiddleware, controller.updateSettings)

// router.post('/favoritePost', authMiddleware, controller.favoritePost)

module.exports  = router
