import Record from 'airtable/lib/record';
import { MAirtable } from './MAirtable';
import { CardFtType } from '../types/CardFtType';

/** представляет ВСЕ полученные с бэка записи */
export class CardsCls {
  public static FIELD_ID = 'id';
  public static FIELD_TID = 'tid';
  public static FIELD_TITLE = 'title';
  public static FIELD_URL = 'url';
  public static FIELD_COMM = 'comm';
  public static FIELD_BODY = 'body';
  public static FIELD_TRANS_COUNT = 'trans_count';
  // type - Date
  public static FIELD_TRANS_DATE_LAST = 'trans_date_last';
  public static FIELD_SHOW_DATE_LAST = 'show_date_last';
  public static FIELD_TAGS = 'tags';
  public static FIELD_BROKEN = 'broken';

  constructor(readonly records: Record[]) {
  }

  countAllGet(): number {
    return this.records.length;
  }

  // [[210222111416]]
  getByIndex(index: number): CardFtType {
    const record = this.records[index];
    return {
      title: record.get(CardsCls.FIELD_TITLE),
      url: record.get(CardsCls.FIELD_URL),
      comm: record.get(CardsCls.FIELD_COMM),
      body: record.get(CardsCls.FIELD_BODY),
      id: record.get(CardsCls.FIELD_ID),
      tid: record.id,
      trans_count: record.get(CardsCls.FIELD_TRANS_COUNT),
      trans_date_last: record.get(CardsCls.FIELD_TRANS_DATE_LAST),
      show_date_last: record.get(CardsCls.FIELD_SHOW_DATE_LAST),
      tags: record.get(CardsCls.FIELD_TAGS),
      broken: record.get(CardsCls.FIELD_BROKEN),
    };
  }

  static async update(tid: string, card: CardFtType) {
    const fields = {
      [CardsCls.FIELD_TRANS_COUNT]: card.trans_count + 1,
      [CardsCls.FIELD_TRANS_DATE_LAST]: card.trans_date_last,
      [CardsCls.FIELD_SHOW_DATE_LAST]: card.show_date_last,
    };
    await MAirtable.recordUpdate(tid, fields);
  }

}
