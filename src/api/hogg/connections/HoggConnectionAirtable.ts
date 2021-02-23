import { HoggConnectionNT } from '../interfaces/HoggConnectionNT';
import { HoggTupleNT } from '../interfaces/HoggTupleNT';
import Airtable from 'airtable';
import Record from 'airtable/lib/record';
import { HoggCellNT } from '../interfaces/HoggCellNT';
import { BaseTuple } from '../base-implements/BaseTuple';
import { BaseCell } from '../base-implements/BaseCell';
import { HoggOffsetCount } from './HoggOffsetCount';
import { HoggResult } from '../utils/HoggResult';

function updConfsGet(tuples: HoggTupleNT[]) {
  const updConfs: any[] = [];
  const isOk = tuples.every(tuple => { // LOOP
    const cells: HoggCellNT[] = tuple.cellsGet();
    const updConf: any = {id: '', fields: {}}
    cells.forEach(cell => { // LOOP-2
      const fieldName = cell.columnNameGet()
      if (fieldName === 'tid') {
        updConf.id = cell.valueGet();
      } else {
        updConf.fields[fieldName] = cell.valueGet()
      }
    }) // LOOP-2
    if (!updConf.id) {
      return false; // stop loop
    }
    updConfs.push(updConf);
    return true;
  }) // LOOP
  return {updConfs, isOk};
}

function updConfsAtCreateGet(tuples: HoggTupleNT[]) {
  const updConfs: any[] = [];
  tuples.forEach(tuple => { // LOOP
    const cells: HoggCellNT[] = tuple.cellsGet();
    const updConf: any = {fields: {}}
    cells.forEach(cell => { // LOOP-2
      const fieldName = cell.columnNameGet()
      updConf.fields[fieldName] = cell.valueGet()
    }) // LOOP-2
    updConfs.push(updConf);
    return true;
  }) // LOOP
  return updConfs;
}

export class HoggConnectionAirtable implements HoggConnectionNT {

  private dbName: string = '';
  private columnNames: string[] = [];
  private tableName: string = '';

  columns(columnNames: string[]): HoggConnectionNT {
    this.columnNames = columnNames;
    return this;
  }

  db(dbeName: string): HoggConnectionNT {
    this.dbName = dbeName;
    return this;
  }

  table(tbeName: string): HoggConnectionNT {
    this.tableName = tbeName;
    return this;
  }

  private static convertRecord(record: Record): HoggTupleNT {
    const {fields} = record;
    const cees: HoggCellNT[] = [];
    for (const [key, value] of Object.entries(fields)) {
      const cee: HoggCellNT = new BaseCell().create(key, value as string);
      cees.push(cee);
    }
    const tidCee = new BaseCell().create('tid', record.id);
    cees.push(tidCee);
    return new BaseTuple().create(cees);
  }

  // TODO учесть columnNames
  async query(offsetCount: HoggOffsetCount): Promise<HoggTupleNT[]> {
    const _th = this;
    return new Promise((resolve, reject) => {
      const ret: HoggTupleNT[] = [];
      const selectCfg = {}
      if (!offsetCount.getAll) {
        const maxRecords = offsetCount.offset + offsetCount.count;
        if (maxRecords > 0) {
          // @ts-ignore
          selectCfg.maxRecords = maxRecords;
          // ---
          // @ts-ignore
          selectCfg.pageSize = maxRecords > 100 ? 100 : maxRecords;
        }
      }
      let counter = 0;
      Airtable
        .base(this.dbName)
        .table(this.tableName)
        .select(selectCfg)
        .eachPage(
          function page(records, fetchNextPage) {
            records.forEach(function (record) {
              counter++;
              if (counter > offsetCount.offset) {
                const tup = HoggConnectionAirtable.convertRecord(record);
                ret.push(tup)
              }
            });
            fetchNextPage();
          },
          function done(err) {
            if (err) {
              console.error(err);
              reject(err)
            }
            resolve(ret)
          }
        )
    });
  }

  init(options: { apiKey: string }): void {
    const {apiKey} = options;
    if (apiKey) {
      const dc = Airtable.default_config()
      dc.apiKey = apiKey
      dc.endpointUrl = 'https://api.airtable.com'
      Airtable.configure(dc)
    } else {
      throw new Error(`[hogg]: [[210223092909]] invalid apiKey [${apiKey}]`)
    }
  }

  async update(tuples: HoggTupleNT[]): Promise<HoggResult<boolean>> {
    if (!(tuples && tuples.length > 0)) {
      return new HoggResult<boolean>(false, '[[210223170254]]', 'tuples is empty')
    } else {
      // ---
      const {updConfs, isOk} = updConfsGet(tuples);
      // ---
      if (!isOk) {
        return new HoggResult(false, '[[210223191902]]', 'tid problem')
      }
      try {
        await Airtable
          .base(this.dbName)
          .table(this.tableName)
          .update(updConfs, function (err: any) {
            if (err) {
              return new HoggResult(false, '[[210223202024]]', err.message)
            }
          })
        return new HoggResult<boolean>(true)
      } catch (e) {
        return new HoggResult<boolean>(false, '[[210223193709]]', e.message)
      }
    }
  }

  async create(tuples: HoggTupleNT[]): Promise<HoggResult<boolean>> {
    if (!(tuples && tuples.length > 0)) {
      return new HoggResult<boolean>(false, '[[210223170254-2]]', 'tuples is empty')
    } else {
      // ---
      const createData = updConfsAtCreateGet(tuples);
      // ---
      try {
        await Airtable
          .base(this.dbName)
          .table(this.tableName)
          .create(createData, function (err: any) {
            if (err) {
              return new HoggResult(false, '[[210223202024-2]]', err.message)
            }
          })
        return new HoggResult<boolean>(true)
      } catch (e) {
        return new HoggResult<boolean>(false, '[[210223193709-2]]', e.message)
      }
    }
  }

  async delete(ids: string[]): Promise<HoggResult<boolean>> {
    await Airtable
      .base(this.dbName)
      .table(this.tableName)
      .destroy(ids, function (err: any) {
        if (err) {
          return new HoggResult(false, '[[210223202024-3]]', err.message)
        }
      })
    return new HoggResult(true)
  }

}

