import { FnegTableNameVeriferNT } from './FnegTableNameVeriferNT';

export interface FnegAdapterNT {
  fnegTableNameVeriferGet(): FnegTableNameVeriferNT
  fnegRowAllCountGet(): number
}
