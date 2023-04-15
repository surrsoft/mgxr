import { HoggTupleNT } from '../../api/hogg/interfaces/HoggTupleNT';
import {
  UARW_COLUMN_NAME,
  UARW_CONF_AIRTABLE_DB_NAME,
  UARW_CONF_AIRTABLE_TABLE_NAME,
  UARW_PROGRESSES
} from '../../consts-uarw';
import { arrObjectsSortByStringProp, colination, SortInfo, ValCount } from './uarw-utils';
import { HoggConnectionAirtable } from '../../api/hogg/connections/HoggConnectionAirtable';
import { HoggOffsetCount } from '../../api/hogg/utils/HoggOffsetCount';
import { HoggConnectionNT } from '../../api/hogg/interfaces/HoggConnectionNT';
import { BaseTuple } from '../../api/hogg/base-implements/BaseTuple';
import { BaseCell } from '../../api/hogg/base-implements/BaseCell';
import { HoggResult } from '../../api/hogg/utils/HoggResult';
import { ApiKeyStorageCls } from '../ApiKeyStorageCls';

export class UarwLogic {

  private static connectionTableCreate(): HoggConnectionNT {
    const connection = new HoggConnectionAirtable();
    const apiKey = ApiKeyStorageCls.apiKeyGet() || '';
    connection.init({apiKey});
    return connection
      .db(UARW_CONF_AIRTABLE_DB_NAME)
      .table(UARW_CONF_AIRTABLE_TABLE_NAME)
  }

  async qcardsGet(filterVusc: string): Promise<QCardOj[]> {
    const data: HoggTupleNT[] = await UarwLogic.connectionTableCreate()
      .filterVusc(filterVusc)
      .query(new HoggOffsetCount(true))
    const uarwTuples = new UarwTuples(data)
    return uarwTuples.qcards
  }

  static async qcardProgressUpdate(cardTid: string, progress: UARW_PROGRESSES): Promise<HoggResult<boolean>> {
    const conn = UarwLogic.connectionTableCreate();
    const tuple = new BaseTuple()
      .cellAdd(new BaseCell().create(UARW_COLUMN_NAME.TID, cardTid))
      .cellAdd(new BaseCell().create(UARW_COLUMN_NAME.PROGRESS, progress))
    const res = await conn.update([tuple])
    return res;
  }

  /**
   * получаем данные для фильтров "область изучения" и "изученность"
   * @param filterVusc
   */
  async scopesAndProgressesGet(filterVusc: string = ''): Promise<{ scopes: ValCount[], progresses: ValCount[], countAll: number }> {
    const tuples = await UarwLogic.connectionTableCreate()
      .columns([
        UARW_COLUMN_NAME.SCOPES,
        UARW_COLUMN_NAME.PROGRESS,
      ])
      .filterVusc(filterVusc)
      .query(new HoggOffsetCount(true))
    // ---
    const scopes: string[] = []
    const progresses: string[] = []
    tuples.forEach(tuple => {
      let b19 = false;
      tuple.cellsGet().forEach(cell => {
        const columnName = cell.columnNameGet();
        const value = cell.valueGet();
        if (columnName === UARW_COLUMN_NAME.SCOPES) {
          scopes.push(value)
        }
        if (columnName === UARW_COLUMN_NAME.PROGRESS) {
          progresses.push(value)
          b19 = true
        }
      })
      if (!b19) {
        progresses.push(UARW_PROGRESSES.P1)
      }
    })
    // ---
    const scopesVC = colination(scopes, new SortInfo(false))
    arrObjectsSortByStringProp(scopesVC, 'value', true)
    const progressesVC = colination(progresses, new SortInfo(false))
    arrObjectsSortByStringProp(progressesVC, 'value', true)
    // ---
    return {scopes: scopesVC, progresses: progressesVC, countAll: tuples.length}
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
        if (columnName === UARW_COLUMN_NAME.SCOPES) {
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
        if (columnName === UARW_COLUMN_NAME.PROGRESS) {
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
  question: string = ''
  answer: string = ''
  progress: string = ''
  scope: string = ''
  subscope: string[] = []
  id: string = ''
  tid: string = ''
  errMsg: string = ''

  static create(tuple: HoggTupleNT): QCardOj {
    const cells = tuple.cellsGet()
    const qcard = new QCardOj();
    cells.forEach(cell => {
      const columnName = cell.columnNameGet()
      const value = cell.valueGet()
      switch (columnName) {
        case UARW_COLUMN_NAME.QUESTION:
          qcard.question = value;
          break;
        case UARW_COLUMN_NAME.ANSWER:
          qcard.answer = value;
          break;
        case UARW_COLUMN_NAME.PROGRESS:
          qcard.progress = value;
          break;
        case UARW_COLUMN_NAME.SCOPES:
          qcard.scope = value;
          break;
        case UARW_COLUMN_NAME.SUBSCOPES:
          qcard.subscope = value as any;
          break;
        case UARW_COLUMN_NAME.TID:
          qcard.tid = value;
          break;
        case UARW_COLUMN_NAME.ID:
          qcard.id = value;
          break;
      }
    })
    if (!qcard.progress) {
      qcard.progress = UARW_PROGRESSES.P1;
    }
    return qcard
  }

  static createMulti(tuples: HoggTupleNT[]): QCardOj[] {
    return tuples.map(tuple => QCardOj.create(tuple))
  }
}
