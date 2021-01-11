import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'User #1',
        email: 'user1@mail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
