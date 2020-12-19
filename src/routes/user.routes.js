const express = require('express')
const app = new express.Router()
const User = require("../models/user")

app.post("/users", async (req, res, next) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (err) {
        res.status(400).send(err)
    }
})
app.patch("/users/:id", async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get("/users", async (req, res, next) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

app.get("/users/:id", async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        res.send(user)
    } catch (e) {
        res.status(404).send()
    }
})


app.delete("/users/:id", async (req, res, next) => {
    try {
        const user = await User.findOneAndDelete(req.params.id)
        if (!user) return res.status(404).send()
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = app