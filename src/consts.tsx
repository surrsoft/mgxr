export const MGXR_APP_REV = '12';

export enum Paths {
  MGXR = '/mgxr',
  UARW = '/uarw',
  UARW2 = '/uarw2',
  UARW_SETTINGS = '/uarw-settings',
  UARW_SETTINGS_2 = '/uarw-settings-2',
  UARW_ABOUT = '/uarw-about',
  NEWS = '/news',
  SETTINGS = '/settings',
  DEBUG = '/debug',
  SOME = '/some'
}

export class Names {
  static values = [
    {link: Paths.MGXR, name: "Главная"},
    {link: Paths.UARW, name: `"Карточки"`},
    {link: Paths.UARW2, name: `"Карточки2"`},
    {link: Paths.UARW_SETTINGS, name: `Настройки`},
    {link: Paths.UARW_ABOUT, name: `О проекте`},
    {link: Paths.NEWS, name: `"Новости"`},
    {link: Paths.SETTINGS, name: `Настройки`},
    {link: Paths.DEBUG, group: 'dropdown-1', name: `Debug`},
    {link: Paths.SOME, group: 'dropdown-1', name: `Some`},
  ]

  static aTagGet(path: Paths) {
    return <div className="cls2040"><a href={path}>{Names.nameGet(path)}</a></div>
  }

  static nameGet(path: Paths): string {
    return Names.values.find(el => el.link === path)?.name || 'text'
  }
}
