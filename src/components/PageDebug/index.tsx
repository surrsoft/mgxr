import { Component } from 'react';
import './styles.css';
import { AirtableAdapter } from '../../api/fneg/AirtableAdapter';
import { LSApiKey } from '../../utils/utils';
import { CONF_AIRTABLE_DB_NAME, CONF_AIRTABLE_TABLE_NAME } from '../../consts';
import { FnegTable } from '../../api/fneg/FnegTable';
import { FnegTableName } from '../../api/fneg/FnegTableName';
import { FnegRow } from '../../api/fneg/FnegRow';
import { HoggTupleNT } from '../../api/hogg/interfaces/HoggTupleNT';
import { HoggConnectionAirtable } from '../../api/hogg/connections/hogg-connection-airtable';

export class PageDebug extends Component<any, any> {

  async np() {
    console.log(`!!-!!-!! 1741-10 -> :::::::::::::: np() {210222174129}:${Date.now()}`); // del+
    const adapter = new AirtableAdapter(LSApiKey.apiKeyGet() || '', CONF_AIRTABLE_DB_NAME)
    const fnegTableName = new FnegTableName(adapter, CONF_AIRTABLE_TABLE_NAME);
    const table = new FnegTable(adapter, fnegTableName)
    const rows: FnegRow[] = await table.rowsGet(3);
    console.log('!!-!!-!! 2022-10 rows {210222202256}\n', rows); // del+
  }

  async np2() {
    const cnn = new HoggConnectionAirtable();
    cnn.init({apiKey: LSApiKey.apiKeyGet() || ''})
    const res: HoggTupleNT[] = await cnn
      .db(CONF_AIRTABLE_DB_NAME)
      .table(CONF_AIRTABLE_TABLE_NAME)
      .query(0, 0);
    console.log('!!-!!-!! res {210223104514}\n', res); // del+
  }

  nx() {
    return <button onClick={() => this.np2()}>DO</button>
  }

  render() {
    return <div className="page_debug">{
      this.nx()
    }</div>
  }
}
