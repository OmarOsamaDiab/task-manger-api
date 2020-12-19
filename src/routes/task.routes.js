const express = require('express')
const app = new express.Router()
const Task = require('../models/task')


app.post("/tasks", async (req, res, next) => {
    try {
        const task = new Task(req.body)
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(err)
    }
})

app.patch('/tasks/:id', async (req, res, next) => {
    const updates = Object.keys(req.body)
    const updatedParams = ["description", "completed"]
    const isOk = updates.every(v => updatedParams.includes(v))
    if (!isOk) return res.status(400).send("params are not existed")
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.get("/tasks", async (req, res, next) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})

app.get("/tasks/:id", async (req, res, next) => {
    try {
        const _id = req.params.id
        const task = await Task.findById(_id)
        res.send(task)
    } catch (e) {
        res.status(404).send()
    }
})

app.delete("/tasks/:id", async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete(req.params.id)
        if (!task) return res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = app