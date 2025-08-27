const pool = require("../config/db")

// GET DATA
const getMovie = async () => {
    try {
        const [result] = await pool.query('SELECT * FROM movie ')
        return result
        
    } catch (error) {
        console.error("Error get movie data function:" + error.message)
    }
}


 const getUser = async () => {
    try {
        const [result] = await pool.query('SELECT * FROM user ')
        return result
        
    } catch (error) {
        console.error("Error get user data function:" + error.message)
    }

}

 const getUserById = async (id) => {
    const [result] = await pool.query
    (`
    SELECT *
    FROM user
    WHERE id = ?
    `,[id])                                                                                                                                                                                                                                                                                                                                                                   
    return result[0]
}

// INSERT DATA ( Register)
 const createUser = async (userData) =>{
    try {
        const { fullname, username, password, email } = userData
        const [ result ] = await pool.query(
          `INSERT INTO user (fullname, username, password, email) 
          VALUES (?, ?, ?, ?)`,
          [fullname, username, password, email]  
        )
        const insert = result.insertId
        return getUser(insert)
    } catch (err) {
        throw new Error('Failed create new user:' + err.message)
    }
}



// EDIT DATA /PUT
const editUser= async (fullname, username, password, email, id) =>{
    const [result] = await pool.query(`
        UPDATE user
        SET fullname= ?, username= ?, password=? , email= ?
        WHERE id = ? 
        `, [fullname, username, password, email, id])
        return result
    }
    
    
    // DELETE DATA
    const deleteUser = async (id) => {
        const [result] = await pool.query(`
            DELETE FROM
            user WHERE id = ? 
            `, [id])
            return result
        }
        
        // VALIDATE USER DATA
        const checkEmail = async (email) => {
            try {
                const [ result ] = await pool.query(`
        SELECT * FROM user WHERE email = ? `, [ email ])
        return result
    } catch (error) {
        console.error("Error Check Email at Model Level (DB)", + error.message)
    }
} 

// FILTER MOVIE
const filterMovie = async ( genre ) => {
    try {
        const [ result ] = await pool.query(`
            SELECT * FROM movie
            WHERE genre = ? 
            `, [ genre ])
            return result 
        } catch (error) {
            console.error("Error Filter Movie at Model Level (DB) : ", error.message )
    }
}

// SORT MOVIE
// sort by title, and genre
const sortMovie = async ( sortBy, order ) => {
    try {
        const allowSortBy = ['id', 'genre']
        const allowOrder = ['ASC', 'DESC']
        const rightSortBy = allowSortBy.includes(sortBy) ? sortBy: 'id'
        const rightOrder = allowOrder.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC' 
        const [ result ] = await pool.query(`
            SELECT * FROM movie
            ORDER BY ${rightSortBy} ${rightOrder} 
            `)
            return result 
        } catch (error) {
            console.error("Error Sort Movie at Model Level (DB) : ", error.message )
        }
    }
    
    
    // SEARCH MOVIE
    const searchMovie = async ( search ) => {
        try {
            const format = `%${search}%`
            const [ result ] = await pool.query(`
                SELECT * FROM movie
                WHERE title LIKE ?
                `, [format])
                return result 
            } catch (error) {
                console.error("Error Search Movie at Model Level (DB) : ", error.message )
            }
        }
        
const createUserToken = async (userData) =>{
    try {
        const { fullname, username, password, email, token } = userData
        const [ result ] = await pool.query(
            `INSERT INTO user (fullname, username, password, email, token, is_verified) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [fullname, username, password, email, token, 0]  
        )
        const insert = result.insertId
        return getUser(insert)
    } catch (err) {
        throw new Error('Failed create new user with token:' + err.message)
    }
}


const verifyUserToken = async (token) => {

    try {
        // Check token 
        const [result] = await pool.query(`
            SELECT * FROM user WHERE token = ?
            `, [token])
            
        // Update is_verified and delete token
        await pool.query('UPDATE user SET is_verified = ?, token = NULL WHERE token = ?', [1, token])

    } catch (err) {
        console.err("Error query verify token user, Please check again!", err)
    }
}
      

module.exports = {
    getUser, getUserById, createUser, editUser, deleteUser, checkEmail, getMovie,
    filterMovie, sortMovie, searchMovie, createUserToken, verifyUserToken
}


