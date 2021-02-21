export class FnegResult {
  constructor(readonly success: boolean = false, readonly code: string = '', readonly comm: string = '') {
  }

  isValid() {
    return this.success
  }

  throwIfNotValid(message: string = '') {
    if (!this.isValid()) {
      let message0 = message
      if (!message0) {
        message0 = JSON.stringify({code: this.code, comm: this.comm})
      }
      throw new Error(message0)
    }
  }
}
