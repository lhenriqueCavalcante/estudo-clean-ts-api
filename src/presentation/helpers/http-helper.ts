import { HttpResponse } from '../protocols/http'
import { ServerError } from '../errors'
export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export function serverError (error: Error): HttpResponse {
  return {
    statusCode: 500,
    body: new ServerError(error.stack)
  }
}

export function ok (data: any): HttpResponse {
  return {
    statusCode: 200,
    body: data
  }
}
