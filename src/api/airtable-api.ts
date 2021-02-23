import Airtable from 'airtable';
import Record from 'airtable/lib/record';
import { CONF_AIRTABLE_DB_NAME, CONF_AIRTABLE_TABLE_NAME } from '../consts';
import { LSApiKey } from '../utils/utils';

export class MAirtable {

  static init() {
    const apiKey = LSApiKey.apiKeyGet()
    if (!apiKey) {
      alert('please add "Airtable API Key" at "Settings"')
    } else {
      const dc = Airtable.default_config()
      dc.apiKey = apiKey
      dc.endpointUrl = 'https://api.airtable.com'
      Airtable.configure(dc)
    }
  }

  /**
   *
   * @param maxRecords -- максимальное количество записей которое нужно вернуть, задействуется если > 0
   */
  static async recordsGet(maxRecords: number = 0): Promise<Record[]> {
    return new Promise((resolve, reject) => {
      const ret: Record[] = [];
      const selectCfg = {}
      if (maxRecords > 0) {
        // @ts-ignore
        selectCfg.maxRecords = maxRecords
      }
      Airtable
        .base(CONF_AIRTABLE_DB_NAME)(CONF_AIRTABLE_TABLE_NAME)
        .select(selectCfg)
        .eachPage(
          function page(records, fetchNextPage) {
            records.forEach(function (record) {
              ret.push(record)
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

  static async recordUpdate(tid: string, fields: any) {
    console.log(`!!-!!-!! 0003-10 -> :::::::::::::: recordUpdate() {210222000258}:${Date.now()}`); // del+
    console.log('!!-!!-!! 0003-20 tid {210222000307}\n', tid); // del+
    console.log('!!-!!-!! 0003-30 fields {210222000322}\n', fields); // del+
    return new Promise((resolve, reject) => {
      const updOj = {id: tid, fields}
      console.log('!!-!!-!! 0003-40 updOj {210222000414}\n', updOj); // del+
      Airtable
        .base(CONF_AIRTABLE_DB_NAME)(CONF_AIRTABLE_TABLE_NAME)
        .update(
          [updOj],
          function (err: any, records: Record[] | undefined) {
            if (err) {
              reject(err);
            }
            resolve(records);
          }
        )
    });
  }
}
