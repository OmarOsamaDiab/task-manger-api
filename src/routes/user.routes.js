const express = require('express')
const app = new express.Router()
const User = require("../models/user")
const auth = require('../middlewares/auth')
const { Router } = require('express')

app.post("/users", async (req, res, next) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

app.post('/users/login', auth, async (req, res, next) => {
    try {
        const user = await User.findByCrediontials({ ...req.body })
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

app.post('/users/logoutAll', async (req, res, next) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

app.post('/users/logout', async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => req.token !== token.token)
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

app.patch("/users/me", auth, async (req, res, next) => {
    try {
        const updates = Object.keys(req.body)
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get("/users/me", auth, async (req, res, next) => {
    try {
        res.send(req.user)
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


app.delete("/users/me", auth, async (req, res, next) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = app