// Write your tests here
const request = require('supertest')
const server = require('./server')

test('sanity', () => {
  expect(server).toBeTruthy()
})
