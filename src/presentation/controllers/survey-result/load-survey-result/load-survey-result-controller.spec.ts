import { HttpRequest, LoadSurveyById, LoadSurveyResult } from './load-survey-result-controller-protocols'
import { LoadSurveyResultController } from './load-survey-result-controller'
import { mockLoadSurveyById, mockLoadSurveyResult } from '@/presentation/test'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import { mockSurveyResultModel, throwError } from '@/domain/test'
import MockDate from 'mockdate'

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  type SutTypes = {
    sut: LoadSurveyResultController
    loadSurveyByIdStub: LoadSurveyById
    loadSurveyResultStub: LoadSurveyResult
  }

  const makeSut = (): SutTypes => {
    const loadSurveyByIdStub = mockLoadSurveyById()
    const loadSurveyResultStub = mockLoadSurveyResult()
    const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)
    return { sut, loadSurveyByIdStub, loadSurveyResultStub }
  }

  const mockRequest = (): HttpRequest => ({
    params: {
      surveyId: 'any_id'
    },
    accountId: 'any_account_id'
  })

  test('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return 403 if LoadSurveyById retuns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const surveyResult = await sut.handle(mockRequest())
    expect(surveyResult).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
    const surveyResult = await sut.handle(mockRequest())
    expect(surveyResult).toEqual(serverError(new Error()))
  })

  test('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_id', 'any_account_id')
  })

  test('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    jest.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(throwError)
    const surveyResult = await sut.handle(mockRequest())
    expect(surveyResult).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.handle(mockRequest())
    expect(surveyResult).toEqual(ok(mockSurveyResultModel()))
  })
})
