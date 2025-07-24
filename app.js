import express from 'express'
import { getMovie, getMovieId, addMovie } from './src/controller/database.js'

const app = express()

app.use(express.json())


// GET ID
app.get('/movie', async (req, res) => {
    const movie = await getMovie()
    res.send(movie)
})

// GET DATA FROM ID
app.get('/movie/:id', async (req, res) => {
    const id = req.params.id
    const movies = await getMovieId(id)
    res.send(movies)
})

// POST DATA 
app.post('/movie', async (req,res) => {
  const { title, description, genre } = req.body
  const movies = await addMovie(title, description, genre)
  res.status(201).send(movies)
})

// ERROR HANDLING
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})

