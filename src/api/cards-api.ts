import cards from './cards.json';
import { TpCard } from '../utils/utils';
import Record from 'airtable/lib/record';
import { MAirtable } from './airtable-api';
import dayjs from 'dayjs';

export class Cards {
  static allGet(): TpCard[] {
    // @ts-ignore
    return cards.cards.map(el => {
      return el
    })
  }

  static countAllGet(): number {
    return cards.cards.length
  }

  static getByIndex(index: number): TpCard {
    // @ts-ignore
    return cards.cards[index]
  }
}

export class CardsB {
  private FIELD_ID = 'id';
  private FIELD_TID = 'tid';
  private FIELD_TITLE = 'title';
  private FIELD_URL = 'url';
  private FIELD_COMM = 'comm';
  private FIELD_BODY = 'body';
  public static FIELD_TRANS_COUNT = 'trans_count';
  // type - Date
  public static FIELD_TRANS_DATE_LAST = 'trans_date_last';
  public static FIELD_SHOW_DATE_LAST = 'show_date_last';

  constructor(readonly records: Record[]) {
  }

  countAllGet(): number {
    return this.records.length
  }

  // [[210222111416]]
  getByIndex(index: number): TpCard {
    const record = this.records[index]
    return new TpCard(
      record.get(this.FIELD_TITLE),
      record.get(this.FIELD_URL),
      record.get(this.FIELD_COMM),
      record.get(this.FIELD_BODY),
      record.get(this.FIELD_ID),
      record.id,
      record.get(CardsB.FIELD_TRANS_COUNT),
      record.get(CardsB.FIELD_TRANS_DATE_LAST),
      record.get(CardsB.FIELD_SHOW_DATE_LAST),
    )
  }

  static async update(tid: string, card: TpCard) {
    const fields = {
      [CardsB.FIELD_TRANS_COUNT]: card.trans_count + 1,
      [CardsB.FIELD_TRANS_DATE_LAST]: card.trans_date_last,
      [CardsB.FIELD_SHOW_DATE_LAST]: card.show_date_last,
    }
    await MAirtable.recordUpdate(tid, fields)
  }

}
