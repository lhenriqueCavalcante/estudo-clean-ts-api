import { RequiredFieldValidation } from '@/validation/validators/required-field-validation'
import { CompareFieldsValidations } from '@/validation/validators/compare-fields-validation'
import { ValidationComposite, EmailValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidations('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
