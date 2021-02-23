import { Component } from 'react';
import './styles.css';
import { LSApiKey } from '../../utils/utils';
import { CONF_AIRTABLE_DB_NAME, CONF_AIRTABLE_TABLE_NAME } from '../../consts';
import { HoggTupleNT } from '../../api/hogg/interfaces/HoggTupleNT';
import { HoggOffsetCount } from '../../api/hogg/connections/HoggOffsetCount';
import { HoggConnectionAirtable } from '../../api/hogg/connections/HoggConnectionAirtable';
import { HoggResult } from '../../api/hogg/utils/HoggResult';
import { BaseCell } from '../../api/hogg/base-implements/BaseCell';
import { BaseTuple } from '../../api/hogg/base-implements/BaseTuple';

export class PageDebug extends Component<any, any> {
  private connection?: HoggConnectionAirtable;

  async query() {
    const connection = new HoggConnectionAirtable();
    connection.init({apiKey: LSApiKey.apiKeyGet() || ''})
    const res: HoggTupleNT[] | undefined = await this.connection?.query(new HoggOffsetCount(false, 0, 10));
    console.log('!!-!!-!! res {210223104514}\n', res); // del+
  }

  async update() {
    const tuple = new BaseTuple()
      .cellAdd(new BaseCell().create('tid', 'rec04BflzOVX54PWs'))
      .cellAdd(new BaseCell().create('comm', '1-1-3'))
    // ---
    const res: HoggResult<boolean> | undefined = await this.connection?.update([tuple])
    console.log('!!-!!-!! res {210223104515}\n', res); // del+
  }

  async create() {
    const tuples = [
      new BaseTuple().cellAdd(new BaseCell().create('title', 'mmm')).cellAdd(new BaseCell().create('comm', '1-1-4')),
      new BaseTuple().cellAdd(new BaseCell().create('title', 'mmm-2')).cellAdd(new BaseCell().create('comm', '1-1-5'))
    ]
    // ---
    const res: HoggResult<boolean> | undefined = await this.connection?.create(tuples)
    console.log('!!-!!-!! res {210223104515}\n', res); // del+
  }

  async delete() {
    const res = await this.connection?.delete(['recgsvfjiB1rDtNP5', 'recNGoZaZe7pPfzOH'])
    console.log('!!-!!-!! res {210223204510}\n', res); // del+
  }

  componentDidMount() {
    this.connection = new HoggConnectionAirtable();
    this.connection.init({apiKey: LSApiKey.apiKeyGet() || ''});
    this.connection
      .db(CONF_AIRTABLE_DB_NAME)
      .table(CONF_AIRTABLE_TABLE_NAME);
  }

  nx() {
    return (
      <div>
        <button onClick={() => this.query()}>Query</button>
        <button onClick={() => this.update()}>Update</button>
        <button onClick={() => this.create()}>Create</button>
        <button onClick={() => this.delete()}>Delete</button>
      </div>
    )
  }

  render() {
    return <div className="page_debug">{
      this.nx()
    }</div>
  }
}
