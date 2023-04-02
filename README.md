- ветка 'develop' - ветка всей разработки

- http://localhost:21860/#/mgxr

- 2023-04-02
  - при запуске на Windows была ошибка 
    ```text
    Error: resolve-url-loader: CSS error
    source-map information is not available at url() declaration (found orphan CR, try removeCR option)
    ```
    - чтобы её исправить, нужно добавить опцию `removeCR: true` для пакета `resolve-url-loader`
      - так как сделать напрямую я это не могу, из-за того что конфигурация webpack у меня зашита в crate-react-app, я прибегнул к обходному способу:
      - я задействовал пакет `react-app-rewired` который позволяет "на лету" менять webpack-конфигурацию
        - [[230402152100]] я установил этот пакет `npm install react-app-rewired --save-dev` , и затем создал файл `root/config-overrides.js` в котором добавляю нужную опцию
      - после этого проект нужно запускать не командой `react-scripts ...`, а командой `react-app-rewired ...`, в том числе другие команды должны иметь такой префикс

- если проект запускается, но на экране пусто, то нужно добавить `/mgxr` в конец URL 