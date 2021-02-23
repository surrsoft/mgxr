import { HoggConnectionNT } from '../interfaces/HoggConnectionNT';
import { HoggTupleNT } from '../interfaces/HoggTupleNT';
import Airtable from 'airtable';
import Record from 'airtable/lib/record';
import { HoggCellNT } from '../interfaces/HoggCellNT';
import { MTup } from '../base-implements/MTup';
import { MCee } from '../base-implements/MCee';

export class HoggConnectionAirtable implements HoggConnectionNT {
  private dbeName: string = '';
  private conNames: string[] = [];
  private tbeName: string = '';

  columns(conNames: string[]): HoggConnectionNT {
    this.conNames = conNames;
    return this;
  }

  db(dbeName: string): HoggConnectionNT {
    this.dbeName = dbeName;
    return this;
  }

  table(tbeName: string): HoggConnectionNT {
    this.tbeName = tbeName;
    return this;
  }

  private convertRecord(record: Record): HoggTupleNT {
    const {fields} = record;
    const cees: HoggCellNT[] = [];
    for (const [key, value] of Object.entries(fields)) {
      const cee: HoggCellNT = new MCee().create(key, value as string);
      cees.push(cee);
    }
    const tidCee = new MCee().create('tid', record.id);
    cees.push(tidCee);
    return new MTup().create(cees);
  }

  async query(offset: number, count: number): Promise<HoggTupleNT[]> {
    const _th = this;
    return new Promise((resolve, reject) => {
      const ret: HoggTupleNT[] = [];
      const selectCfg = {}

      const maxRecords = 3; // TODO temp
      if (maxRecords > 0) {
        // @ts-ignore
        selectCfg.maxRecords = maxRecords
      }

      Airtable
        .base(this.dbeName)
        .table(this.tbeName)
        .select(selectCfg)
        .eachPage(
          function page(records, fetchNextPage) {
            records.forEach(function (record) {
              const tup = _th.convertRecord(record);
              ret.push(tup)
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

}

