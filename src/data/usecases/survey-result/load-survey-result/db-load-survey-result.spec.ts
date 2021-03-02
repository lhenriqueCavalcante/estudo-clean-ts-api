import { LoadSurveyResultRepository } from './db-load-survey-result-protocols'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { mockLoadSurveyResultRepository } from '@/data/test'
import { throwError } from '@/domain/test'

describe('DbLoadSurveyResult UseCase', () => {
  type SutTypes = {
    loadSurveyResultRepositoryStub: LoadSurveyResultRepository
    sut: DbLoadSurveyResult
  }

  const makeSut = (): SutTypes => {
    const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
    const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
    return { loadSurveyResultRepositoryStub, sut }
  }

  test('Should call LoadSurveyResultRepository with id', async () => {
    const { loadSurveyResultRepositoryStub, sut } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load('any_survey_id')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { loadSurveyResultRepositoryStub, sut } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)
    const surveys = sut.load('any_survey_id')
    await expect(surveys).rejects.toThrow()
  })
})
