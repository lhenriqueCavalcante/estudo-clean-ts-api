import { LoadSurveysRepository } from './db-load-surveys-protocols'
import { DbLoadSurveys } from './db-load-surveys'
import { mockSurveysModels, throwError } from '@/domain/test'
import { mockLoadSurveysRepository } from '@/data/test'
import mockdate from 'mockdate'

const accountId = 'any_id'

type SutTypes = {
  loadSurveysRepositoryStub: LoadSurveysRepository
  sut: DbLoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return { loadSurveysRepositoryStub, sut }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    mockdate.set(new Date())
  })
  afterAll(() => {
    mockdate.reset()
  })
  test('Should call LoadSurveysRepository with correct values', async () => {
    const { loadSurveysRepositoryStub, sut } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load(accountId)
    expect(loadAllSpy).toHaveBeenCalledWith(accountId)
  })

  test('Should returns a list of Surveys', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load(accountId)
    expect(surveys).toEqual(mockSurveysModels())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { loadSurveysRepositoryStub, sut } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(throwError)
    const surveys = sut.load(accountId)
    await expect(surveys).rejects.toThrow()
  })
})
