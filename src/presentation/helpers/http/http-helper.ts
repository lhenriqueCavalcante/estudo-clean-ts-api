import { HttpResponse } from '../../protocols/http'
import { ServerError, UnauthorizedError } from '../../errors'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
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

export function noContent (): HttpResponse {
  return {
    statusCode: 204,
    body: null
  }
}
