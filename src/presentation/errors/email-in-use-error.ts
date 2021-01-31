export class EmailUseError extends Error {
  constructor () {
    super('The recived email is already in use')
    this.name = 'EmailUseError'
  }
}
