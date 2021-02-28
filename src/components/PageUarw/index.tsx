import { Component } from 'react';
import Loader from 'react-loader';
import { selectOptionToVusc, ValCount, ValLabel } from '../../utils/uarw/uarw-utils';
import Select from 'react-select';
import './styles.scss'
import { QCard } from './QCard';
import { QCardOj, UarwLogic, UarwTuples } from '../../utils/uarw/uarw-logic';
import { UARW_FE_PROGRESS, UARW_FE_SCOPES } from '../../consts-uarw';
import { Button, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

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
  selectMode: number
}

enum SelectMode {
  STRICT = 1,
  FREE = 2
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

export class PageUarw extends Component<any, UarwState> {
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
      selectMode: SelectMode.STRICT
    }
    this.selectScHandleChange = this.selectScHandleChange.bind(this);
    this.selectPrHandleChange = this.selectPrHandleChange.bind(this);
    this.handleShowCards = this.handleShowCards.bind(this);
    this.selectModeChange = this.selectModeChange.bind(this);
  }

  async componentDidMount() {
    this.setState({loaded: true});
    this.uarwLogic = new UarwLogic();
    await this.selectorsDataGetAndUpdate();
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

  async handleShowCards() {
    try {
      this.setState({loaded: false});
      // ---
      let filterVusc = this.fnFilterVuscGet();
      // ---
      const qcardOjs = await this.uarwLogic?.qcardsGet(filterVusc);
      // ---
      this.setState({
        qcards: qcardOjs || [],
        loaded: true,
      })
    } catch (err) {
      this.setState({loaded: true, errStr: err.message})
    }
  }

  private fnFilterVuscGet() {
    console.log('!!-!!-!! this.state.selectScSelectedOption {210228142743}\n', this.state.selectScSelectedOption); // del+
    console.log('!!-!!-!! this.state.selectPrSelectedOption {210228142743}\n', this.state.selectPrSelectedOption); // del+

    let filterScVusc = selectOptionToVusc(UARW_FE_SCOPES, this.state.selectScSelectedOption as { value: string });
    let filterPrVusc = selectOptionToVusc(UARW_FE_PROGRESS, this.state.selectPrSelectedOption as { value: string });
    if (filterScVusc && filterPrVusc) {
      return `AND(${filterScVusc}, ${filterPrVusc})`
    } else if (filterScVusc) {
      return filterScVusc
    } else {
      return filterPrVusc
    }
  }

  async selectModeChange(mode: SelectMode) {
    console.log(`!!-!!-!! -> :::::::::::::: radioChange() {210228113307}:${Date.now()}`); // del+
    console.log('!!-!!-!! mode {210228115358}\n', mode); // del+
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
                className="select-mode"
                name="value"
                type="radio"
                value={this.state.selectMode}
                onChange={this.selectModeChange}
              >
                <ToggleButton value={1} variant="secondary" size="sm">strict</ToggleButton>
                <ToggleButton value={2} variant="secondary" size="sm">free</ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div className="get-button">
              <Button onClick={this.handleShowCards} variant="success" size="sm">show all</Button>
            </div>
          </Loader>
          <Loader loaded={this.state.loaded} position='relative'>
            <div className="qcards">
              {
                qcards.map(qcard => {
                  return <QCard qcard={qcard}/>
                })
              }
            </div>
          </Loader>
        </div>
      }
    </div>
  }
}
