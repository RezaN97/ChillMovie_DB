import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD ,
    database: process.env.MYSQL_DATABASE
}).promise()



// GET DATA
export async function getMovie() {
    const [data] = await pool.query("SELECT * FROM movie")
    return data
}

export async function getMovieId(id){
    const [data] = await pool.query
    (`
    SELECT *
    FROM movie
    WHERE id = ?
    `,[id])                                                                                                                                                                                                                                                                                                                                                                   
    return data[0]
}

// INSERT DATA
export async function addMovie(title, description, genre){
    const [data] = await pool.query(`
    INSERT INTO movie (title, description, genre)
    VALUES (?, ?, ?)
    `,[title, description, genre])    
    const insert =  data.insertId
    return getMovie(insert)
}

