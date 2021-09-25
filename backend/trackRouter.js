const Router = require('express')
const router = new Router()
const controller = require('./trackController')
const multer  = require('multer')
const {check} = require('express-validator')
const authMiddleware = require('./middleware/authMiddleware')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        if(file.fieldname === "url"){
            cb(null, './uploads/tracks/')
        }
        if(file.fieldname === "logo"){
            cb(null, './uploads/images/')
        }
    },
    filename(req, file, cb) {
        if(file.fieldname === "url"){
            cb(null,  "musicamp-" + Date.now() + file.originalname)
        }
        if(file.fieldname === "logo"){
            cb(null,  "musicamp-" + Date.now() + ".jpg")
        }
    }
})

const fileFilter = (req, file, cb) => {
    if (file.fieldname === "url"){
        if (file.mimetype === 'audio/mpeg') {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
    if (file.fieldname === "logo"){
        if ( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }

}

const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024},
    fileFilter: fileFilter,
    fields: [{ name: 'url', maxCount: 1 }, { name: 'logo', maxCount: 1 }]
}).fields([{ name: 'url', maxCount: 1 }, { name: 'logo', maxCount: 1 }])

router.post('/trackUpload',
    function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.status(400).json({message:'upload error'})
        }
        next()
    })},
    [check('title', "Заголовок не может быть пустым").notEmpty()],
    authMiddleware, controller.trackUpload)

router.get('/getUserTracks', controller.getUserTracks)

router.get('/getOneTrack', controller.getOneTrack)

router.post('/albumUpload',
    function (req, res, next) {
        upload(req, res, function (err) {
            if (err) {
                return res.status(400).json({message:'upload error'})
            }
            next()
        })},
    [check('title', "Заголовок не может быть пустым").notEmpty()],
    authMiddleware, controller.albumUpload)

router.get('/getAlbum', controller.getAlbum)

router.post('/deleteTrack', authMiddleware, controller.deleteTrack)

module.exports  = router
