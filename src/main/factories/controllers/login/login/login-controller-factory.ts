import { makeLoginValidation } from './login-validation-facotry'
import { Controller } from '../../../../../presentation/protocols'
import { makeDbAuthentication } from '../../../usecases/authentication/db-authentication-factory'
import { LoginController } from '../../../../../presentation/controllers/login/login/login-controller'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  return makeLogControllerDecorator(new LoginController(makeDbAuthentication(), makeLoginValidation()))
}
