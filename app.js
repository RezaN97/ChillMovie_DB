const express = require("express")
const router = require("./router/router")

const app = express()

app.use(express.json())
app.use('/api', router)

app.listen(8080, () => console.log("Server running at port 8080"))