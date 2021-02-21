import { FnegAdapterNT } from './FnegAdapterNT';

export class FnegTableName {
  constructor(readonly adapter: FnegAdapterNT, readonly name: string) {
    adapter.fnegTableNameVeriferGet().verify(name).throwIfNotValid();
  }
}
