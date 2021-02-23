import { HoggTupleNT } from './HoggTupleNT';

export interface HoggConnectionNT {
  db(dbName: string): HoggConnectionNT
  table(tableName: string): HoggConnectionNT
  columns(columnNames: string[]): HoggConnectionNT

  init(options: object): void;
  query(offset: number, count: number): Promise<HoggTupleNT[]>
}
