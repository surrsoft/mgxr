import { FnegAdapterNT } from './FnegAdapterNT';

export class FnegTableName {
  constructor(readonly adapter: FnegAdapterNT, readonly name: string) {
    const fnegResult = adapter.tableNameVerify(name);
    fnegResult.throwIfNotValid()
  }
}
