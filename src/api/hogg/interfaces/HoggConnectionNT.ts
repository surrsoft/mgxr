import { HoggTupleNT } from './HoggTupleNT';
import { HoggOffsetCount } from '../connections/HoggOffsetCount';
import { HoggResult } from '../utils/HoggResult';

export interface HoggConnectionNT {
  db(dbName: string): HoggConnectionNT

  table(tableName: string): HoggConnectionNT

  columns(columnNames: string[]): HoggConnectionNT

  /**
   * Некоторым *источникам может требоваться инициализация, этот метод для этого
   * @param options
   */
  init(options: object): void;

  /**
   * Получение данных
   * @param offsetCount
   */
  query(offsetCount: HoggOffsetCount): Promise<HoggTupleNT[]>

  update(tuples: HoggTupleNT[]): Promise<HoggResult<boolean>>

  create(tuples: HoggTupleNT[]): Promise<HoggResult<boolean>>

  delete(ids: string[]): Promise<HoggResult<boolean>>
}
