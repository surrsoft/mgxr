import _ from 'lodash';

export class TpCard {
  constructor(
    readonly title?: string,
    readonly url?: string,
    readonly comm?: string,
    readonly body?: string
  ) {
  }
}

export const tpCards = [
  new TpCard('Российская газета', 'https://rg.ru'),
  new TpCard('Коммерсант', 'https://www.kommersant.ru/'),
  new TpCard('РИА Новости', 'https://ria.ru/')
]

/**
 * Возвращает случайное число в диапазоне 0 .. (1) включая 0 и (1), но отсутствующее в (2).
 * Если такого случайного числа найти невозможно (из-за того что в (2) уже все индексы есть), то возвращает -1
 *
 * ID [[210219210500]], rev.2 1.1 2021-02-19
 *
 * @param ix (1) -- например 3
 * @param arrExcept -- например [0, 1]
 * @return например может вернуть только 2 или 3
 */
export function randomExcept(ix: number, arrExcept: [number]): number {
  if (_.isEmpty(arrExcept)) {
    return _.random(ix);
  }
  const arr0 = [];
  for (let ix0 = 0; ix0 <= ix; ix0++) {
    const b0 = arrExcept.some(el => el === ix0);
    if (!b0) {
      arr0.push(ix0)
    }
  }
  if (arr0.length > (ix + 1) || arr0.length === 0) {
    return -1
  }
  const rnd = _.random(arr0.length - 1);
  return arr0[rnd];
}
