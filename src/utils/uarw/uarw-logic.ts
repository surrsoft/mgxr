import { HoggTupleNT } from '../../api/hogg/interfaces/HoggTupleNT';
import {
  UARW_CONF_AIRTABLE_DB_NAME, UARW_CONF_AIRTABLE_TABLE_NAME,
  UARW_FE_ANSWER,
  UARW_FE_ID,
  UARW_FE_PROGRESS,
  UARW_FE_QUESTION,
  UARW_FE_SCOPES,
  UARW_FE_TID, UARW_PV_PROGRESS_1
} from '../../consts-uarw';
import { arrObjectsSortByStringProp, colination, SortInfo, ValCount } from './uarw-utils';
import { HoggConnectionAirtable } from '../../api/hogg/connections/HoggConnectionAirtable';
import { LSApiKey } from '../utils';
import { HoggOffsetCount } from '../../api/hogg/connections/HoggOffsetCount';
import { HoggConnectionNT } from '../../api/hogg/interfaces/HoggConnectionNT';

export class UarwLogic {

  private static connectionTableCreate() {
    const connection = new HoggConnectionAirtable();
    const apiKey = LSApiKey.apiKeyGet() || '';
    connection.init({apiKey});
    return connection
      .db(UARW_CONF_AIRTABLE_DB_NAME)
      .table(UARW_CONF_AIRTABLE_TABLE_NAME)
  }

  async qcardsGet(filterVusc: string): Promise<QCardOj[]> {
    const data: HoggTupleNT[] = await UarwLogic.connectionTableCreate()
      .filterVusc(filterVusc)
      .query(new HoggOffsetCount(true))
    console.log('!!-!!-!! data {210226000136}\n', data); // del+
    const uarwTuples = new UarwTuples(data)
    return uarwTuples.qcards
  }

  async scopesAndProgressesGet(): Promise<{ scopes: ValCount[], progresses: ValCount[] }> {
    const data = await UarwLogic.connectionTableCreate()
      .columns([UARW_FE_SCOPES, UARW_FE_PROGRESS])
      .query(new HoggOffsetCount(true))
    console.log('!!-!!-!! data {210227201209}\n', data); // del+
    // ---
    const scopes: string[] = []
    const progresses: string[] = []
    data.forEach(tuple => {
      tuple.cellsGet().forEach(cell => {
        const columnName = cell.columnNameGet();
        const value = cell.valueGet();
        let b19 = false;
        if (columnName === UARW_FE_SCOPES) {
          scopes.push(value)
        }
        if (columnName === UARW_FE_PROGRESS) {
          progresses.push(value)
          b19 = true
        }
        if (!b19) {
          progresses.push(UARW_PV_PROGRESS_1)
        }
      })
    })
    // ---
    const scopesVC = colination(scopes, new SortInfo(false))
    arrObjectsSortByStringProp(scopesVC, 'value', true)
    const progressesVC = colination(progresses, new SortInfo(false))
    arrObjectsSortByStringProp(progressesVC, 'value', true)
    // ---
    return {scopes: scopesVC, progresses: progressesVC}
  }
}

export class UarwTuples {
  public qcards: QCardOj[];

  constructor(readonly tuples: HoggTupleNT[]) {
    this.qcards = QCardOj.createMulti(this.tuples)
  }

  scopesGet(): ValCount[] {
    const scopes: string[] = [];
    this.tuples.forEach(tuple => {
      tuple.cellsGet().forEach(cell => {
        const columnName = cell.columnNameGet()
        const value = cell.valueGet()
        if (columnName === UARW_FE_SCOPES) {
          scopes.push(value)
        }
      })
    })
    // ---
    return colination(scopes, new SortInfo(true, false))
  }

  progressesGet(): ValCount[] {
    const pgs: string[] = [];
    this.tuples.forEach(tuple => {
      tuple.cellsGet().forEach(cell => {
        const columnName = cell.columnNameGet()
        const value = cell.valueGet()
        if (columnName === UARW_FE_PROGRESS) {
          pgs.push(value)
        }
      })
    })
    // ---
    const valCounts = colination(pgs);
    arrObjectsSortByStringProp(valCounts, 'value', true);
    return valCounts
  }

}

export class QCardOj {
  public question: string = ''
  public answer: string = ''
  public progress: string = ''
  public scope: string = ''
  public id: string = ''
  public tid: string = ''

  static create(tuple: HoggTupleNT): QCardOj {
    const cells = tuple.cellsGet()
    const qcard = new QCardOj();
    cells.forEach(cell => {
      const columnName = cell.columnNameGet()
      const value = cell.valueGet()
      switch (columnName) {
        case UARW_FE_QUESTION:
          qcard.question = value;
          break;
        case UARW_FE_ANSWER:
          qcard.answer = value;
          break;
        case UARW_FE_PROGRESS:
          qcard.progress = value;
          break;
        case UARW_FE_SCOPES:
          qcard.scope = value;
          break;
        case UARW_FE_TID:
          qcard.tid = value;
          break;
        case UARW_FE_ID:
          qcard.id = value;
          break;
      }
    })
    return qcard
  }

  static createMulti(tuples: HoggTupleNT[]): QCardOj[] {
    return tuples.map(tuple => QCardOj.create(tuple))
  }
}
