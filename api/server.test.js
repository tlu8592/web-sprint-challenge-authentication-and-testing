// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

test('sanity', () => {
  expect(server).toBeTruthy()
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

describe('server.js', () => {
  describe('[POST] /api/auth/register', () => {
    it ('[1] responds with correct status when client does not provide username or password', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'Captain Marvel' })
      const res2 = await request(server).post('/api/auth/register').send({ password: 'foobar' })
      expect(res.body.message && res2.body.message).toMatch(/username and password required/i)
    }, 750)
    it ('[2] responds with proper status code on sucessful registration', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'Captain Marvel', password: 'foobar' })
      expect(res.status).toBe(201)
    }, 750)
    it ('[3] responds with proper message if username is taken', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'Captain Marvel', password: 'foobar' })
      expect(res.body.message).toMatch(/username taken/i)
    }, 750)
  })
  describe('[POST] /api/auth/login', () => {
    it('[4] responds with correct message if credentials are valid', async () => {
      const res = await request(server).post('/api/auth/login').send({ username: 'Captain Marvel', password: 'foobar' })
      expect(res.body.message).toMatch(/welcome, Captain Marvel/i)
    }, 750)
    it ('[5] responds with correct status when client does not provide username or password', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'Captain Marvel' })
      const res2 = await request(server).post('/api/auth/register').send({ password: 'foobar' })
      expect(res.body.message && res2.body.message).toMatch(/username and password required/i)
    }, 750)
    it ('[6] responds with correct status code if username does not exist or password is incorrect', async () => {
      const res = await request(server).post('/api/auth/login').send({ username: 'bob', password: '1234' })
      expect(res.status).toBe(401)
    }, 750)
    it ('[7] responds with correct message if username does not exist or password is incorrect', async () => {
      const res = await request(server).post('/api/auth/login').send({ username: 'bob', password: '1234' })
      expect(res.body.message).toMatch(/invalid credentials/i)
    }, 750)
  })
  describe('[GET] /api/jokes', () => {
    it('[8] requests without a token end with proper status', async () => {
      const res = await request(server).get('/api/jokes')
      expect(res.status).toBe(401)
    }, 750)
    it('[9] requests without a token end with proper message', async () => {
      const res = await request(server).get('/api/jokes')
      expect(res.body.message).toMatch(/token required/i)
    }, 750)
  })
})