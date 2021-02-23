import { HoggTupleNT } from '../interfaces/HoggTupleNT';
import { HoggCellNT } from '../interfaces/HoggCellNT';

export class BaseTuple implements HoggTupleNT {
  private cells: HoggCellNT[] = [];

  cellsGet(): HoggCellNT[] {
    return this.cells;
  }

  create(cells: HoggCellNT[]): HoggTupleNT {
    this.cells = cells;
    return this;
  }

  cellAdd(cell: HoggCellNT): HoggTupleNT {
    this.cells.push(cell);
    return this;
  }

}
