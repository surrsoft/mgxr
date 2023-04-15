export class CardCls {
  constructor(
    readonly title?: string,
    readonly url?: string,
    readonly comm?: string,
    readonly body?: string,
    readonly id?: string,
    readonly tid?: string,
    readonly trans_count: number = 0,
    readonly trans_date_last?: string,
    readonly show_date_last?: string,
    readonly tags?: string[],
  ) {
  }
}