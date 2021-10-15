const request = require('supertest')
const server = require('../api/server')
const db = require('../data/dbConfig')

beforeEach(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).toBe(true)
})

describe('[1] POST "api/auth/register"', () => {

  describe('username/password is missing', () => {
    it('returns status 400 with message: "username and password required" when username missing', async () => {
      const res = await request(server).post('/api/auth/register').send({ password: '1234' })
      expect(res.status).toBe(400)
      expect(res.body).toMatchObject({ message: 'username and password required' })
    })
    it('returns status 400 with message: "username and password required" when password is missing', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'san' })
      expect(res.status).toBe(400)
      expect(res.body).toMatchObject({ message: 'username and password required' })
    })
    it('returns status 400 with message: "username and password required" when username and password are missing', async () => {
      const res = await request(server).post('/api/auth/register').send()
      expect(res.status).toBe(400)
      expect(res.body).toMatchObject({ message: 'username and password required' })
    })

  })

  describe('username is taken', () => {
    it('returns status 400 with message: "username taken" when username already taken', async () => {
      await request(server).post('/api/auth/register').send({ username: "bar", password: "1234" })
      const res = await request(server).post('/api/auth/register').send({ username: "bar", password: "4567" })
      expect(res.status).toBe(400)
      expect(res.body).toMatchObject({ message: 'username taken' })
    })

    describe('register successfully', () => {
      let res
      beforeEach(async () => {
        res = await request(server).post('/api/auth/register').send({ username: "fizz", password: "1234" })
      })
      it('returns new user with correct id and username after sucessfully registering', () => {
        expect(res.body).toMatchObject({ id: 1, username: "fizz" })
      })
      it('returns status 201 after sucessfully registering', () => {
        expect(res.status).toBe(201)
      })
    })

  })
})

describe('[2] POST "/api/auth/login"', () => {
  describe('missing username/password', () => {
    it('returns status 400, message: "username and password required" when username is undefined', async () => {
      const res = await request(server).post('/api/auth/login').send({
        password:
          '1234'
      })
      expect(res.status).toBe(400)
      expect(res.body).toMatchObject({ message: 'username and password required' })
    })
    it('returns status 400, message: "username and password required" when password is undefined', async () => {
      const res = await request(server).post('/api/auth/login').send({
        username:
          'lizzy'
      })
      expect(res.status).toBe(400)
      expect(res.body).toMatchObject({ message: 'username and password required' })
    })
    it('returns status 400, message: "username and password required" when username and password is undefined', async () => {
      const res = await request(server).post('/api/auth/login').send()
      expect(res.status).toBe(400)
      expect(res.body).toMatchObject({ message: 'username and password required' })
    })
  })

  describe('login with invalid username/password', () => {
    beforeEach(async () => {
      await request(server).post('/api/auth/register').send({ username: 'sam', password: "1234" })
    })
    it('returns status 401 , message: "invalid credentials" when logging in with invalid username', async () => {
      const res = await request(server).post('/api/auth/login').send({ username: 'van', password: "1234" })
      expect(res.status).toBe(401)
      expect(res.body).toMatchObject({ message: 'invalid credentials' })
    })
    it('returns status 401 , message: "invalid credentials" when logging in with invalid password', async () => {
      const res = await request(server).post('/api/auth/login').send({ username: 'sam', password: "5678" })
      expect(res.status).toBe(401)
      expect(res.body).toMatchObject({ message: 'invalid credentials' })
    })
  })

  describe('login successfully', () => {
    it('returns status 200, with the message "welcome, `username`', async () => {
      await request(server).post('/api/auth/register').send({ username: 'bazz', password: "1234" })
      const res = await request(server).post('/api/auth/login').send({ username: 'bazz', password: "1234" })
      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ message: 'welcome, bazz' })

    })
  })
})

describe('[3] GET "/api/jokes"', () => {
  it('returns status 401 with message "token required" if no token provided', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.status).toBe(401)
    expect(res.body).toMatchObject({ message: 'token required' })
  })
  it('returns status 401 with message "token invalid" if providing invalid token', async () => {
    const res = await request(server).get('/api/jokes').set('Authorization', 'faketoken')
    expect(res.status).toBe(401)
    expect(res.body).toMatchObject({ message: 'token invalid' })
  })
  it('returns status correct jokes with correct token', async () => {
    await request(server).post('/api/auth/register').send({ username: 'bazz', password: "1234" })
    let res = await request(server).post('/api/auth/login').send({ username: 'bazz', password: "1234" })
    res = await request(server).get('/api/jokes').set('Authorization', res.body.token)
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject([
      {
        "id": "0189hNRf2g",
        "joke": "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."
      },
      {
        "id": "08EQZ8EQukb",
        "joke": "Did you hear about the guy whose whole left side was cut off? He's all right now."
      },
      {
        "id": "08xHQCdx5Ed",
        "joke": "Why didn’t the skeleton cross the road? Because he had no guts."
      },
    ])
  })

})

