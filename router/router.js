const express = require("express")
const { uploadMultipleFile,uploadFile, verifyUserToken, register, login , getMovieResponse, filterMovie, sortMovie, searchMovie} = require("../controller/controller")
const model = require("../models/models")
const upload = require("../middleware/multer")
const router = express.Router()

// ROUTE FOR CRUD for USER DB
router.get('/user', model.getUser)
router.get('/user/:id', model.getUserById)
router.post('/user', model.createUser)
router.put('/user/:id', model.editUser)
router.delete('/user/:id', model.deleteUser)


// Register user 
router.post('/user/register', register)

// Login user 
router.post('/user/login',login)

// Get Data Movie with Auth Token 
router.get('/movie', getMovieResponse)

// MOVIE DATA (FILTER, SEARCH, SORT)
// filter
router.get('/movie/filter', filterMovie)
// search
router.get('/movie/search', searchMovie)
// sort
router.get('/movie/sort', sortMovie)

// send Email verification
router.post('/register', register)

// verify token from email
router.get('/verify/:token', verifyUserToken)

// upload single file with Multer
router.post('/upload', upload.single('file'), uploadFile)

// upload multiple file
router.post('/upload-multiple', upload.array('files', 5), uploadMultipleFile)

module.exports = router



