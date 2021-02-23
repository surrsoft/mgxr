export class HoggResult<T> {
  constructor(readonly value: T, readonly code: string = '', readonly comm: string = '') {
  }
}
