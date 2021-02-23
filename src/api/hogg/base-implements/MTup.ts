import { HoggTupleNT } from '../interfaces/HoggTupleNT';
import { HoggCellNT } from '../interfaces/HoggCellNT';

export class MTup implements HoggTupleNT {
  private cells: HoggCellNT[] = [];

  cellsGet(): HoggCellNT[] {
    return this.cells;
  }

  create(cells: HoggCellNT[]): HoggTupleNT {
    this.cells = cells;
    return this;
  }

}
