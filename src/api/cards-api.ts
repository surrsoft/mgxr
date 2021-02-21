import cards from './cards.json';
import { TpCard } from '../utils/utils';
import Record from 'airtable/lib/record';

export class Cards {
  static allGet(): TpCard[] {
    return cards.cards.map(el => {
      return el
    })
  }

  static countAllGet(): number {
    return cards.cards.length
  }

  static getByIndex(index: number): TpCard {
    return cards.cards[index]
  }
}

export class CardsB {
  private FIELD_TITLE = 'title';
  private FIELD_URL = 'url';
  private FIELD_COMM = 'comm';
  private FIELD_BODY = 'body';

  constructor(readonly records: Record[]) {
  }

  countAllGet(): number {
    return this.records.length
  }

  getByIndex(index: number): TpCard {
    const record = this.records[index]
    return new TpCard(
      record.get(this.FIELD_TITLE),
      record.get(this.FIELD_URL),
      record.get(this.FIELD_COMM),
      record.get(this.FIELD_BODY)
    )
  }

}
