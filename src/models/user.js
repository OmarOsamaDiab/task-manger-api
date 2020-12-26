const mongoose = require('../db/mongoose')
const validator = require('validator')
const bycrpt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid')
            }
        }
    },
    age: {
        type: Number,
        default: 1,
        validate(value) {
            if (value <= 0) {
                throw new Error('age must be a positive number')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        validate(value) {
            if (value.length <= 6) {
                throw new Error('password must be at least 6 chars')
            }
            if (value.toLowerCase().includes('password')) {
                throw new Error('password must not contain password keyword')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ id: user._id.toString() }, 'thisomartoken')
    user.tokens.push({ token })
    await user.save()
    return token
}

userSchema.statics.findByCrediontials = async ({ email, password }) => {
    const user = await User.findOne({ email })

    if (!user) throw new Error('unable to login')

    const isMatch = await bycrpt.compare(password, user.password)

    if (!isMatch) throw new Error('unable to login')

    return user
}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bycrpt.hash(user.password, 8)
    }
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
