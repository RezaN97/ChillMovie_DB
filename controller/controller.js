const express = require("express")
const model = require("../models/models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const app = express()
const dotenv = require("dotenv")
const smtp = require("./nodemailer")
const { v4: uuidv4 } = require("uuid")


dotenv.config()
app.use(express.json())

// RESPONSE get Movie with auth Token
const getMovieResponse = async (req, res) => {
    try {
        const [result] = await model.getMovie() 
        res.status(200).json({ movies: result})
    } catch (error) {
        console.error('Error get movie data (controller): ', error)
        res.status(500).json({ message: 'Failed get Movie, Server Error'})
    }
    
    res.json({ message: 'Data Movie berhasil diakses', user:req.user})
}

// SET REGISTER METHOD use bcrypt
const register  =  async (req, res) => {
    try {
        const { fullname, username, password, email} = req.body
        const hashPassword = await bcrypt.hash(password, 10)
        const tokenUnique = uuidv4()
        

        if(!fullname || !username || !password || !email) {
            return res.status(400).json({ message: "Please Input fullname, username, password, email" })  
        }
        const user = await model.createUserToken({ fullname, username, password: hashPassword, email, token:tokenUnique, }) 

        const verifyLink = `http://localhost:8080/verify/${tokenUnique}`;
        await smtp.sendMail({
            from: `"Verify Team" <no-reply@example.com>`,
            to: 'user@example.com',
            subject: 'Email Verifikasi',
            html: `<p>Click <a href="${verifyLink}">Disini</a> untuk verifikasi email anda.</p>`,
        });

        res.status(201).json({ message: 'User berhasil ditambah dan Verifikasi email dikirim!' , user});
        
    } catch (error) {
        console.error("Error create new user & send Email:", error)
        res.status(500).json({ message: 'Server is error', error: error.message})
    }
}


const verifyUserToken= async (req, res) => {
    try {
        const { token } =req.params
        const user = await model.verifyUserToken(token)
        
        res.status(200).json({ message: 'Email berhasil di verifikasi', user})
    } catch (err) {
        res.status(400).json({ error: err.message})
    }
}

// SET LOGIN METHOD use bcrypt
const login =  async (req, res) => {
    try {
        // Validate EMAIL
        const { email, password } = req.body
        const [users] = await model.checkEmail( email, password)

        
        if (!users.email) {
            return res.status(401).send("Email tidak ditemukan")
        }
        
        
        // Validate PASSWORD
        const validatePass = await bcrypt.compare(password, users.password)
        if (!validatePass) {
            return res.status(401).send('Password salah')
        }

        // Generate JWT 
        const token = jwt.sign({ userId: users.id}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'})
        
        // Respon email and password valid
        res.status(200).json({ message: 'Login berhasil' , token})
   
    } catch (error) {
        console.error("Proses Login Gagal, Error di controller:" + error.message)
        res.status(500).send("Internal Server Error")
    }
}

// FILTER
const filterMovie = async (req, res) => {
    try {
        const { genre } = req.query
        if (!genre || genre.trim() === " ") {
            return res.status(400).json({ error: "Invalid sort parameter" })
        }
        const query = await model.filterMovie(genre)
        res.status(200).json({ movie: query})

    } catch (error) {
        console.error("Filter Movie gagal periksa kembali params :" + error.message)
        res.status(500).json({ message: "Server error at contoller level"})
        
    }
}

// SORT
const sortMovie = async (req, res) => {
    try {
        const { sortBy= 'id', order } = req.query
        
        if (sortBy.trim() === " " && order.trim === " ") {
            return res.status(400).json({ error: "Invalid sort parameter" })
        }
        const query  = await model.sortMovie(sortBy, order)
        res.status(200).json({ movie: query})
    } catch (error) {
        console.error("Sort Movie gagal periksa kembali params :" + error.message)
        res.status(500).json({ message: "Server error at contoller level"})
    }
}

// SEARCH
const searchMovie = async (req,res) => {
   try {
        const { title } = req.query
        
        if (title.trim() === " ") {
            return res.status(400).json({ error: "Invalid search parameter" })
        }
        const query  = await model.searchMovie(title)
        res.status(200).json({ movie: query})
    } catch (error) {
        console.error("Search Movie gagal periksa kembali params :" + error.message)
        res.status(500).json({ message: "Server error at contoller level"})
    }
}

const uploadFile = async (req, res) => {
  try {
      
      if (!req.file) {
          return res.status(400).json({ message: 'No file Upload'})
      }
  
      res.status(200).json({
          message: 'File upload success',
          file: req.file
      })
  } catch (err) {
    res.status(500).json({ message: 'Upload File Failed'})
  }
}

const uploadMultipleFile = async (req, res) => {
    try {
        if(!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No Files Upload'})
        }

        res.status(200).json({
            message: 'Files upload success',
            file: req.files.map(file => ({
                originalName: file.originalName,
                mimeType: file.mimeType,
                size: file.size,
                path: file.path
            }))
        })
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error})
    }
}

module.exports = 
{ 
register, login , getMovieResponse, filterMovie, searchMovie,
sortMovie, verifyUserToken, uploadFile, uploadMultipleFile
}


