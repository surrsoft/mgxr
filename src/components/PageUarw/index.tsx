import React, { Component } from 'react';
import Loader from 'react-loader';
import { selectOptionToVusc, ValCount, ValLabel } from '../../utils/uarw/uarw-utils';
import Select from 'react-select';
import './styles.scss'
import { QCard } from './QCard';
import { QCardOj, UarwLogic, UarwTuples } from '../../utils/uarw/uarw-logic';
import { Button, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { UARW_COLUMN_NAME, UARW_PROGRESSES } from '../../consts-uarw';
import { HoggResult } from '../../api/hogg/utils/HoggResult';
import { Paths } from '../../consts';
import UarwNavbar from './UarwNavbar';
import { Route, Switch, withRouter } from 'react-router-dom';
import { UarwSettings } from './UarwSettings';
import { UarwAbout } from './UarwAbout';

interface UarwState {
  uarwTuples: UarwTuples | null,
  loaded: boolean,
  loadedScopes: boolean,
  scopesSelectMode: boolean,
  errStr: string,
  selectScOptions: object[],
  selectScSelectedOption: object | object[] | null,
  selectPrOptions: object[],
  selectPrSelectedOption: object | object[] | null,
  qcards: QCardOj[],
  countAll: number,
  selectMode: number,
  randomMode: number,
}

enum SelectMode {
  STRICT = 1,
  FREE = 2
}

enum RandomMode {
  /**
   * Показать все карточки в случайном порядке
   */
  A = 1,
  B
}

function fnOptionsRefresh(currSelectOption: object | object[] | null, newVL: ValLabel[]): object | object[] | null {
  if (currSelectOption && newVL && newVL.length > 0) {
    if (Array.isArray(currSelectOption)) {
      return currSelectOption.map(el => {
        // @ts-ignore
        const np = newVL.find(nx => nx.value === el.value)
        return np ? np : el
      })
    } else {
      // @ts-ignore
      const np = newVL.find(nx => nx.value === currSelectOption.value)
      return np ? np : currSelectOption
    }
  }
  return currSelectOption
}

class PageUarw extends Component<any, UarwState> {
  private uarwLogic?: UarwLogic;

  constructor(props: any) {
    super(props);
    this.state = {
      loaded: false,
      loadedScopes: false,
      scopesSelectMode: true,
      uarwTuples: null,
      errStr: '',
      selectScOptions: [],
      selectScSelectedOption: null,
      selectPrOptions: [],
      selectPrSelectedOption: null,
      qcards: [],
      countAll: 0,
      selectMode: SelectMode.STRICT,
      randomMode: RandomMode.A,
    }
    this.selectScHandleChange = this.selectScHandleChange.bind(this);
    this.selectPrHandleChange = this.selectPrHandleChange.bind(this);
    this.handleShowCards = this.handleShowCards.bind(this);
    this.selectModeChange = this.selectModeChange.bind(this);
  }

  async componentDidMount() {
    console.log('!!-!!-!! this.props {210308092038}\n', this.props); // del+
    this.setState({loaded: true});
    this.uarwLogic = new UarwLogic();
    await this.selectorsDataGetAndUpdate();
  }

  hadleQCardProgressChange = async (qcardTid: string, newProgress: UARW_PROGRESSES): Promise<boolean> => {
    console.log(`!!-!!-!! -> :::::::::::::: hadleQCardProgressChange() {210302225851}:${Date.now()}`); // del+
    // --- обновление прогресса *карточки на сервере
    const hoggResult: HoggResult<boolean> = await UarwLogic.qcardProgressUpdate(qcardTid, newProgress)
    console.log('!!-!!-!! hoggResult {210302225339}\n', hoggResult); // del+
    // ---
    if (!hoggResult.value) {
      const qcardWithErr = this.state.qcards.find(qcard => qcard.tid === qcardTid)
      if (qcardWithErr) {
        qcardWithErr.errMsg = JSON.stringify(hoggResult);
        console.log('!!-!!-!! qcardWithErr {210303001137}\n', qcardWithErr); // del+
        this.setState({qcards: [...this.state.qcards]})
        return false
      }
    }
    return true
  }

  /**
   * Получение списка *скоупов и *прогрессов, в соответствии с выбранными в текущий момент *скоупами и *прогрессами
   * @private
   */
  private async selectorsDataGetAndUpdate() {
    if (this.uarwLogic) {
      try {
        this.setState({loadedScopes: false})
        // ---
        // получение текущих *скоупов/*прогрессов и формирование на их базе [vusc]-строки
        const filterVusc = this.fnFilterVuscGet();
        const {scopes, progresses, countAll} = await this.uarwLogic.scopesAndProgressesGet(filterVusc);
        this.setState({loadedScopes: true, countAll});
        // ---
        const scopesVL: ValLabel[] = ValCount.asValLabels(scopes)
        const progressesVL: ValLabel[] = ValCount.asValLabels(progresses)
        // ---
        const newSelectScSelectedOption = fnOptionsRefresh(this.state.selectScSelectedOption, scopesVL)
        const newSelectPrSelectedOption = fnOptionsRefresh(this.state.selectPrSelectedOption, progressesVL)
        const newState = {
          selectScOptions: scopesVL,
          selectScSelectedOption: newSelectScSelectedOption,
          selectPrOptions: progressesVL,
          selectPrSelectedOption: newSelectPrSelectedOption
        };
        this.setState(newState)
      } catch (err) {
        this.setState({errStr: err.message})
      }
    }
  }

  async selectScHandleChange(selectedOption: any) {
    this.setState({selectScSelectedOption: selectedOption, qcards: []}, async () => {
      await this.selectHandleChange()
    })
  }

  async selectPrHandleChange(selectedOption: any) {
    this.setState({selectPrSelectedOption: selectedOption, qcards: []}, async () => {
      await this.selectHandleChange()
    })
  }

  async selectHandleChange() {
    if (this.state.selectMode === SelectMode.STRICT) {
      await this.selectorsDataGetAndUpdate();
    }
  }

  async handleShowCards(random: boolean = false) {
    try {
      this.setState({loaded: false});
      let filterVusc = this.fnFilterVuscGet();
      const qcardOjs = await this.uarwLogic?.qcardsGet(filterVusc);
      if (random) {
        if (this.state.randomMode === RandomMode.A) {
          qcardOjs?.sort(() => Math.random() - 0.5)
        }
        if (this.state.randomMode === RandomMode.B) {
          alert('no realised!')
        }
      }
      this.setState({
        qcards: qcardOjs || [],
        loaded: true,
      })
    } catch (err) {
      this.setState({loaded: true, errStr: err.message})
    }
  }

  private fnFilterVuscGet() {
    let filterScVusc = selectOptionToVusc(UARW_COLUMN_NAME.SCOPES, this.state.selectScSelectedOption as { value: string });
    let filterPrVusc = selectOptionToVusc(UARW_COLUMN_NAME.PROGRESS, this.state.selectPrSelectedOption as { value: string });
    if (filterScVusc && filterPrVusc) {
      return `AND(${filterScVusc}, ${filterPrVusc})`
    } else if (filterScVusc) {
      return filterScVusc
    } else {
      return filterPrVusc
    }
  }

  async selectModeChange(mode: SelectMode) {
    this.setState({
      selectMode: mode,
      selectScSelectedOption: null,
      selectPrSelectedOption: null,
      qcards: []
    }, () => {
      if (mode === SelectMode.FREE) {
        this.selectorsDataGetAndUpdate()
      }
    })
  }

  render() {
    const {
      selectScOptions,
      selectScSelectedOption,
      selectPrOptions,
      selectPrSelectedOption,
      qcards,
      countAll
    } = this.state;
    return <div>
      <UarwNavbar/>
      <Switch>
        <Route path={Paths.UARW + Paths.UARW_SETTINGS_2} exact render={() => (<div>111-111</div>)}/>
        <Route path={Paths.UARW + Paths.UARW_SETTINGS} exact component={UarwSettings}/>
        <Route path={Paths.UARW + Paths.UARW_ABOUT} exact component={UarwAbout}/>
        <Route path={Paths.UARW} exact>
          {this.state.errStr
            ? <div>{this.state.errStr}</div>
            :
            <div className="uarw-container">
              <div className="cards-count">Карточек: {countAll}</div>
              <Loader loaded={this.state.loadedScopes} position="relative" top="30px">
                <div className="selects-container">
                  <Select
                    className="select-scopes"
                    value={selectScSelectedOption}
                    options={selectScOptions}
                    onChange={this.selectScHandleChange}
                    isMulti
                  />
                  <Select
                    className="select-progresses"
                    value={selectPrSelectedOption}
                    options={selectPrOptions}
                    onChange={this.selectPrHandleChange}
                    isMulti
                  />
                  <ToggleButtonGroup
                    className="uarw-select-mode"
                    name="value"
                    type="radio"
                    value={this.state.selectMode}
                    onChange={this.selectModeChange}
                  >
                    <ToggleButton value={SelectMode.STRICT} size="sm">strict</ToggleButton>
                    <ToggleButton value={SelectMode.FREE} size="sm">free</ToggleButton>
                  </ToggleButtonGroup>
                </div>
                <div className="random-mode-container">
                  <div>random mode:</div>
                  <ToggleButtonGroup
                    className="random-mode-select"
                    name="value"
                    type="radio"
                    value={this.state.randomMode}
                    onChange={this.randomModeChange}
                  >
                    <ToggleButton value={RandomMode.A} size="sm">A</ToggleButton>
                    <ToggleButton value={RandomMode.B} size="sm">B</ToggleButton>
                  </ToggleButtonGroup>
                  {this.fnRandomModeCommentGet()}
                </div>
                <div className="buttons">
                  <div className="show-random-btn">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => this.showRandomHandle()}
                      disabled={this.state.randomMode === RandomMode.B}
                    >show random</Button>
                  </div>
                  <div className="get-button">
                    <Button onClick={() => this.handleShowCards()} variant="success" size="sm">show all</Button>
                  </div>
                </div>
              </Loader>
              <Loader loaded={this.state.loaded} position='relative'>
                <div className="qcards">
                  {
                    qcards.map((qcard, index) => {
                      return <QCard
                        key={index}
                        qcard={qcard}
                        qcardProgressChange={this.hadleQCardProgressChange}
                      />
                    })
                  }
                </div>
              </Loader>
            </div>
          }
        </Route>
      </Switch>
    </div>
  }

  private fnRandomModeCommentGet() {
    let text = '';
    switch (this.state.randomMode) {
      case RandomMode.A:
        text = 'показ всех карточек, в случайном порядке'
        break;
      case RandomMode.B:
        text = '-';
        break;
    }
    return <div className="cls2121">{text}</div>
  }

  randomModeChange = (mode: RandomMode) => {
    this.setState({randomMode: mode})
  }

  async showRandomHandle() {
    await this.handleShowCards(true)
  }
}

export default withRouter(PageUarw);
