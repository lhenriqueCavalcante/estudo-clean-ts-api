import { makeLoginValidation } from './login-validation-facotry'
import { Controller } from '@/presentation/protocols'
import { LoginController } from '@/presentation/controllers/login/login/login-controller'
import { makeDbAuthentication } from '@/main/factories/usecases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  return makeLogControllerDecorator(new LoginController(makeDbAuthentication(), makeLoginValidation()))
}
