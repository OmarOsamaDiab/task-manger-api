const express = require('express')
const app = new express.Router()
const Task = require('../models/task')
const auth = require('../middlewares/auth')

app.post("/tasks", auth, async (req, res, next) => {
    try {
        const task = new Task({ ...req.body, owner: req.user._id })
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(err)
    }
})

app.patch('/tasks/:id', auth, async (req, res, next) => {
    const updates = Object.keys(req.body)
    const updatedParams = ["description", "completed"]
    const isOk = updates.every(v => updatedParams.includes(v))
    if (!isOk) return res.status(400).send("params are not existed")
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) return res.status(404).send()
        updates.forEach(update => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.get("/tasks", auth, async (req, res, next) => {
    try {
        const { completed, limit, skip, sortBy } = req.query
        const match = {}
        const sort = {}
        if (completed) {
            match.completed = completed === 'true'
        }
        if (sortBy) {
            const parts = sortBy.split(':')
            sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
        }
        const tasks = await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(limit),
                skip: parseInt(skip),
                sort: {

                }
            }
        }).execPopulate()
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})

app.get("/tasks/:id", async (req, res, next) => {
    try {
        const _id = req.params.id
        const task = await Task.findOne({ _id, owner: req.user._id })
        res.send(task)
    } catch (e) {
        res.status(404).send()
    }
})

app.delete("/tasks/:id", auth, async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) return res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = app