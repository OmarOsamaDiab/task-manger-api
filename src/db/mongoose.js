const mongoose = require('mongoose')

mongoose.connect('mongodb://mongo:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

module.exports = mongoose
