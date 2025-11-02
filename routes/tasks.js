// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const mongoose = require('mongoose');

// GET /api/v1/tasks
router.get('/', async (req, res) => {  // removed next
  try {
    const { status, q, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const filter = {};
    if (status === 'completed') filter.completed = true;
    if (status === 'pending') filter.completed = false;
    if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }];

    const tasks = await Task.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/tasks
router.post('/', async (req, res) => {  // removed next
  try {
    const { title, description, dueDate, priority } = req.body;
    if (!title) return res.status(400).json({ success: false, error: 'Title is required' });
    const task = await Task.create({ title, description, dueDate, priority });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/tasks/:id
router.get('/:id', async (req, res) => {  // removed next
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/v1/tasks/:id
router.put('/:id', async (req, res) => {  // removed next
  try {
    const upd = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, upd, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/v1/tasks/:id/complete
router.patch('/:id/complete', async (req, res) => {  // removed next
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Not found' });
    task.completed = !task.completed;
    await task.save();
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, data: deleted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
