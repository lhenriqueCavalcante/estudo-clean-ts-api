import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

describe('Log Mongo Repository', () => {
  let errortCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errortCollection = await MongoHelper.getCollection('errors')
    await errortCollection.deleteMany({})
  })

  const makeSut = (): LogMongoRepository => {
    return new LogMongoRepository()
  }
  test('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await errortCollection.countDocuments()
    expect(count).toBe(1)
  })
})
