const mongoose = require('../db/mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
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
    }
})

module.exports = User
