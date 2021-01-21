import { DbAuthentication } from './db-authentication'
import {
  AccountModel,
  AuthenticationModel,
  HashComparer,
  TokenGenerator,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

describe('DbAuthentication UseCase', () => {
  const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
  })

  const makeFakeAuthentication = (): AuthenticationModel => ({
    email: 'any_email@mail.com',
    password: 'any_password'
  })

  const makeTokenGenerator = (): TokenGenerator => {
    class TokenGenerator implements TokenGenerator {
      async generate (id: string): Promise<string> {
        return await new Promise(resolve => resolve('any_token'))
      }
    }
    return new TokenGenerator()
  }

  const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
      async update (id: string, token: string): Promise<void> {
        return await new Promise(resolve => resolve())
      }
    }
    return new UpdateAccessTokenRepositoryStub()
  }

  const makeHashComparer = (): HashComparer => {
    class HashCompareStub implements HashComparer {
      async compare (value: string, hash: string): Promise<boolean> {
        return await new Promise(resolve => resolve(true))
      }
    }
    return new HashCompareStub()
  }

  const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        return await new Promise(resolve => resolve(makeFakeAccount()))
      }
    }
    return new LoadAccountByEmailRepositoryStub()
  }
  interface SutTypes {
    loadAccountByEmailRepository: LoadAccountByEmailRepository
    sut: DbAuthentication
    hashComparerStub: HashComparer
    tokenGeneratorStub: TokenGenerator
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  }
  const makeSut = (): SutTypes => {
    const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
    const tokenGeneratorStub = makeTokenGenerator()
    const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
    const hashComparerStub = makeHashComparer()
    const sut = new DbAuthentication(
      loadAccountByEmailRepository,
      hashComparerStub,
      tokenGeneratorStub,
      updateAccessTokenRepositoryStub)

    return {
      loadAccountByEmailRepository,
      sut,
      hashComparerStub,
      tokenGeneratorStub,
      updateAccessTokenRepositoryStub
    }
  }

  test('Sould call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Sould throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Sould return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('Sould call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Sould throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Sould return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('Sould call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Sould throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Sould call TokenGenerator with correct id', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe('any_token')
  })

  test('Sould call UpdateAcessTokenRepositiry with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth(makeFakeAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Sould throw if updateAccessTokenRepositoryStub throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
