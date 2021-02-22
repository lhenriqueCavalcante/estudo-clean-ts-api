import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}
  async handle (httRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(httRequest.params.surveyId)
    return null
  }
}
