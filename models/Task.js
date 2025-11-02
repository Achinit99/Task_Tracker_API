const mongoose = require('mongoose');


const TaskSchema = new mongoose.Schema({
title: { type: String, required: true, trim: true, maxlength: 200 },
description: { type: String, trim: true },
completed: { type: Boolean, default: false },
priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
dueDate: { type: Date },
createdAt: { type: Date, default: Date.now },
updatedAt: { type: Date, default: Date.now }
});


TaskSchema.pre('save', function (next) {
this.updatedAt = Date.now();
next();
});


module.exports = mongoose.model('Task', TaskSchema);