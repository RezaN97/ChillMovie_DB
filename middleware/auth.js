const jwt = require("jsonwebtoken")
require('dotenv').config()

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]

    if(!authHeader){
        return res.status(401).json({ message: 'Authorization header tidak ada'})
    }

    if(!token) {
        return res.status(401).json({ message: 'Token tidak ditemukan di header '})
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded
        next()
    } catch (err) {
        console.error('Error auth process: '+ err.message)
        return res.status(403).json({  message: 'Token kadaluarsa'})
    }
}

module.exports = verifyToken;


