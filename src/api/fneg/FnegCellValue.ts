import { FnegColumnName } from './FnegColumnName';

export class FnegCellValue {
  constructor(readonly columnName: FnegColumnName, readonly value?: string) {
  }
}
