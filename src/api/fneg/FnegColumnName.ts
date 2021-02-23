import { FnegAdapterNT } from './FnegAdapterNT';

export class FnegColumnName {
  constructor(readonly adapter: FnegAdapterNT, readonly columnName: string) {
    adapter.columnNameVerify(columnName).throwIfNotValid()
  }
}
