export interface CardFtType {
  title?: string,
  url?: string,
  comm?: string,
  body?: string,
  id?: string,
  tid?: string,
  trans_count: number,
  trans_date_last?: string,
  show_date_last?: string,
  tags?: string[],
  /** если здесь truthy, то значит ресурс стал недействительным (не работает и т.п.).
   * Текст который здесь как раз поясныет что с сайтом не так */
  broken?: string,
  rating?: number;
}