import { FnegAdapterNT } from './FnegAdapterNT';
import { FnegTableNameVeriferA } from './FnegTableNameVeriferA';

export class AirtableAdapter implements FnegAdapterNT {
  fnegTableNameVeriferGet() {
    return new FnegTableNameVeriferA()
  }

  fnegRowAllCountGet(): number {
    return 0;
  }
}
