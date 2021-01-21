import { AccountModel } from '../../../domain/models/account'
import { AuthenticationModel } from '../../../domain/usecases/athentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

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

  const makeHashComparerStub = (): HashComparer => {
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
  }
  const makeSut = (): SutTypes => {
    const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
    const hashComparerStub = makeHashComparerStub()
    const sut = new DbAuthentication(loadAccountByEmailRepository, hashComparerStub)

    return { loadAccountByEmailRepository, sut, hashComparerStub }
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
})
