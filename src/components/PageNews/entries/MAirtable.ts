import Airtable from 'airtable';
import AirtableRecord from 'airtable/lib/record';

import { ApiKeyStorageCls } from '../../../utils/ApiKeyStorageCls';
import { CONF_AIRTABLE_DB_NAME, CONF_AIRTABLE_TABLE_NAME } from '../constants';

export class MAirtable {

  static init() {
    const apiKey = ApiKeyStorageCls.apiKeyGet()
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
  static async recordsGet(maxRecords: number = 0): Promise<AirtableRecord[]> {
    return new Promise((resolve, reject) => {
      const ret: AirtableRecord[] = [];
      // --- selectCfg
      const selectCfg: Airtable.SelectOptions = {}
      if (maxRecords > 0) {
        selectCfg.maxRecords = maxRecords
      }
      // ---
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
    return new Promise((resolve, reject) => {
      const updOj = {id: tid, fields}
      Airtable
        .base(CONF_AIRTABLE_DB_NAME)(CONF_AIRTABLE_TABLE_NAME)
        .update(
          [updOj],
          function (err: any, records: AirtableRecord[] | undefined) {
            if (err) {
              reject(err);
            }
            resolve(records);
          }
        )
    });
  }
}
