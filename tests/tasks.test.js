const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Task = require('../models/Task');


beforeAll(async () => {
const uri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/tasktracker_test';
await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});


afterEach(async () => {
await Task.deleteMany({});
});


afterAll(async () => {
await mongoose.connection.close();
});


test('POST /api/v1/tasks creates task', async () => {
const res = await request(app).post('/api/v1/tasks').send({ title: 'Test task' });
expect(res.statusCode).toBe(201);
expect(res.body.data.title).toBe('Test task');
});


test('GET /api/v1/tasks returns list', async () => {
await Task.create({ title: 'A' });
await Task.create({ title: 'B', completed: true });
const res = await request(app).get('/api/v1/tasks');
expect(res.statusCode).toBe(200);
expect(Array.isArray(res.body.data)).toBeTruthy();
expect(res.body.data.length).toBe(2);
});


test('PATCH /api/v1/tasks/:id/complete toggles completed', async () => {
const t = await Task.create({ title: 'Toggle me' });
const res = await request(app).patch(`/api/v1/tasks/${t._id}/complete`).send();
expect(res.statusCode).toBe(200);
expect(res.body.data.completed).toBe(true);
});