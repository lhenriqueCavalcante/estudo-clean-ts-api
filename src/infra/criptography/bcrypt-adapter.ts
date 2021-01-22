import bcrypt from 'bcrypt'
import { Hasher } from '../../data/protocols/criptography/hasher'

export class BcryptAdapter implements Hasher {
  private readonly salt
  constructor (salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return await new Promise(resolve => resolve(hash))
  }
}
