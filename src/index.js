const express = require('express')
const app = express()
const port = process.env.PORT || 3000


const taskRoutes = require('./routes/task.routes')
const userRoutes = require('./routes/user.routes')

app.use(express.json())
app.use(taskRoutes)
app.use(userRoutes)


app.listen(port, () => {
    console.log("app is working now")
})