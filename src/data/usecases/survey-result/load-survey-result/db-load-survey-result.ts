import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result copy'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async load (SurveyId: string): Promise<SurveyResultModel> {
    await this.loadSurveyResultRepository.loadBySurveyId(SurveyId)
    return await Promise.resolve(null)
  }
}
