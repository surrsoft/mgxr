import cards from './cards.json';
import { TpCard } from '../utils/utils';

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
