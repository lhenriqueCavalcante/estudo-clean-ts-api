import { LoadSurveyResultRepository, LoadSurveyByIdRepository } from './db-load-survey-result-protocols'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { mockLoadSurveyByIdRepository, mockLoadSurveyResultRepository } from '@/data/test'
import { mockEmptySurveyResultModel, mockSurveyResultModel, throwError } from '@/domain/test'
import MockDate from 'mockdate'

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  type SutTypes = {
    loadSurveyResultRepositoryStub: LoadSurveyResultRepository
    loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
    sut: DbLoadSurveyResult
  }

  const makeSut = (): SutTypes => {
    const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
    const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
    const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)
    return { loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub, sut }
  }

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { loadSurveyResultRepositoryStub, sut } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load('any_survey_id', 'any_account_id')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id', 'any_account_id')
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { loadSurveyResultRepositoryStub, sut } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)
    const survey = sut.load('any_survey_id', 'any_account_id')
    await expect(survey).rejects.toThrow()
  })

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    await sut.load('any_survey_id', 'any_account_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should returns SurveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    const survey = await sut.load('any_survey_id', 'any_account_id')
    expect(survey).toEqual(mockEmptySurveyResultModel())
  })

  test('Should return SurveyResultModel on Succes', async () => {
    const { sut } = makeSut()
    const survey = await sut.load('any_survey_id', 'any_account_id')
    expect(survey).toEqual(mockSurveyResultModel())
  })
})
