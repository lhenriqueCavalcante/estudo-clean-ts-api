import { SurveyResultModel, LoadSurveyResult, LoadSurveyResultRepository, LoadSurveyByIdRepository } from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load (SurveyId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(SurveyId)
    if (!surveyResult) {
      await this.loadSurveyByIdRepository.loadById(SurveyId)
    }
    return surveyResult
  }
}
