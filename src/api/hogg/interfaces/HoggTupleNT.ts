import { HoggCellNT } from './HoggCellNT';

export interface HoggTupleNT {
  create(cells: HoggCellNT[]): HoggTupleNT

  cellsGet(): HoggCellNT[]
}
