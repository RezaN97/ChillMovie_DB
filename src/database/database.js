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
    const [sql] = await pool.query("SELECT * FROM movie")
    return sql
}

export async function getMovieId(id){
    const [sql] = await pool.query
    (`
    SELECT *
    FROM movie
    WHERE id = ?
    `,[id])                                                                                                                                                                                                                                                                                                                                                                   
    return sql[0]
}

// INSERT DATA
export async function addMovie(title, description, genre){
    const [sql] = await pool.query(`
    INSERT INTO movie (title, description, genre)
    VALUES (?, ?, ?)
    `,[title, description, genre])    
    const insert =  sql.insertId
    return getMovie(insert)
}

// EDIT DATA /PUT
export async function editMovie(title, description, genre, id){
    const [sql] = await pool.query(`
        UPDATE movie
        SET title= ? , description= ? , genre= ?
        WHERE id = ? 
    `, [title, description, genre, id])
    return sql
}


// DELETE DATA
export async function deleteMovie(id) {
    const [sql] = await pool.query(`
        DELETE FROM
        movie WHERE id = ? 
    `, [id])
    return sql
}
