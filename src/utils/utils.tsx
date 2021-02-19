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
