import { AuthenticationModel } from '@/domain/models/authentication'

export const mockAuthenticationModel = (): AuthenticationModel => {
  return {
    accessToken: 'any_token',
    name: 'any_name'
  }
}
