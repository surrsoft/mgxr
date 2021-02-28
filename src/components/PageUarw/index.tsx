import { Component } from 'react';
import Loader from 'react-loader';
import { selectOptionToVusc, ValCount, ValLabel } from '../../utils/uarw/uarw-utils';
import Select from 'react-select';
import './styles.scss'
import { QCard } from './QCard';
import { QCardOj, UarwLogic, UarwTuples } from '../../utils/uarw/uarw-logic';
import { UARW_FE_PROGRESS, UARW_FE_SCOPES } from '../../consts-uarw';

interface UarwState {
  uarwTuples: UarwTuples | null,
  loaded: boolean,
  loadedScopes: boolean,
  errStr: string,
  selectScOptions: object[],
  selectScSelectedOption: object | object[] | null,
  selectPrOptions: object[],
  selectPrSelectedOption: object | object[] | null,
  qcards: QCardOj[],
  countAll: number
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
  private flag1: boolean = false;

  constructor(props: any) {
    super(props);
    this.state = {
      loaded: false,
      loadedScopes: false,
      uarwTuples: null,
      errStr: '',
      selectScOptions: [],
      selectScSelectedOption: null,
      selectPrOptions: [],
      selectPrSelectedOption: null,
      qcards: [],
      countAll: 0
    }
    this.selectScHandleChange = this.selectScHandleChange.bind(this);
    this.selectPrHandleChange = this.selectPrHandleChange.bind(this);
    this.handleShowCards = this.handleShowCards.bind(this);
  }

  async componentDidMount() {
    this.setState({loaded: true});
    this.uarwLogic = new UarwLogic();
    await this.selectorsDataGetAndUpdate();
  }

  async componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<UarwState>, snapshot?: any) {
    console.log(`!!-!!-!! -> :::::::::::::: componentDidUpdate() {210227231432}:${Date.now()}`); // del+
    if (this.flag1) {
      this.flag1 = false;
      await this.selectHandleChange();
    }
  }

  /**
   * Получение списка *скоупов и *прогрессов, в соответствии с выбранными в текущий момент *скоупами и *прогрессами
   * @private
   */
  private async selectorsDataGetAndUpdate() {
    if (this.uarwLogic) {
      this.setState({loadedScopes: false})
      // --- получение текущих *скоупов/*прогрессов и формирование на их базе [vusc]-строки
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
    }
  }

  async selectScHandleChange(selectedOption: any) {
    console.log(`!!-!!-!! -> :::::::::::::: selectScHandleChange() {210227231432}:${Date.now()}`); // del+
    this.flag1 = true;
    this.setState({selectScSelectedOption: selectedOption, qcards: []})
  }

  async selectPrHandleChange(selectedOption: any) {
    console.log(`!!-!!-!! -> :::::::::::::: selectPrHandleChange() {210227231432}:${Date.now()}`); // del+
    this.flag1 = true;
    this.setState({selectPrSelectedOption: selectedOption, qcards: []})
  }

  async selectHandleChange() {
    console.log(`!!-!!-!! -> :::::::::::::: selectHandleChange() {210227231432_1}:${Date.now()}`); // del+
    await this.selectorsDataGetAndUpdate();
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
            </div>
            <div className="get-button">
              <input type="button" onClick={this.handleShowCards} value="get"/>
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
