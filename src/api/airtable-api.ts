import Airtable from 'airtable';
import Record from 'airtable/lib/record';
import { CONF_AIRTABLE_API_KEY, CONF_AIRTABLE_BASE, CONF_AIRTABLE_TABLE_NAME } from '../consts';

export class MAirtable {

  static init() {
    const dc = Airtable.default_config()
    dc.apiKey = CONF_AIRTABLE_API_KEY
    dc.endpointUrl = 'https://api.airtable.com'
    Airtable.configure(dc)
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
        .base(CONF_AIRTABLE_BASE)(CONF_AIRTABLE_TABLE_NAME)
        .select(selectCfg)
        .eachPage(
          function page(records, fetchNextPage) {
            console.count('page')
            console.log('!!-!!-!! records.length {210221000727}\n', records.length); // del+
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
}
