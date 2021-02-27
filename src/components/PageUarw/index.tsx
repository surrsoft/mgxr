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
  errStr: string,
  selectScOptions: object[],
  selectScSelectedOption: object | object[] | null,
  selectPrOptions: object[],
  selectPrSelectedOption: object | object[] | null,
  qcards: QCardOj[],
  countAll: number
}


export class PageUarw extends Component<any, UarwState> {
  private uarwLogic?: UarwLogic;

  constructor(props: any) {
    super(props);
    this.state = {
      loaded: false,
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
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    this.uarwLogic = new UarwLogic()
    this.setState({loaded: false})
    const {scopes, progresses, countAll} = await this.uarwLogic.scopesAndProgressesGet();
    this.setState({loaded: true, countAll})
    this.onSuccess(scopes, progresses);
  }

  private onSuccess(scopes: ValCount[], progresses: ValCount[]) {
    const scopesVL: ValLabel[] = ValCount.asValLabels(scopes)
    const progressesVL: ValLabel[] = ValCount.asValLabels(progresses)
    // ---
    this.setState({
      selectScOptions: scopesVL,
      selectScSelectedOption: scopesVL[0],
      selectPrOptions: progressesVL,
      selectPrSelectedOption: progressesVL[0]
    })
  }

  selectScHandleChange(selectedOption: any) {
    this.setState({selectScSelectedOption: selectedOption})
  }

  selectPrHandleChange(selectedOption: any) {
    this.setState({selectPrSelectedOption: selectedOption})
  }

  async handleClick() {
    try {
      this.setState({loaded: false});
      // ---
      let filterScVusc = selectOptionToVusc(UARW_FE_SCOPES, this.state.selectScSelectedOption as { value: string });
      console.log('!!-!!-!! filterScVusc {210227210928}\n', filterScVusc); // del+
      let filterPrVusc = selectOptionToVusc(UARW_FE_PROGRESS, this.state.selectPrSelectedOption as { value: string });
      console.log('!!-!!-!! filterPrVusc {210227211201}\n', filterPrVusc); // del+
      let filterVusc = '';
      if (filterScVusc && filterPrVusc) {
        filterVusc = `AND(${filterScVusc}, ${filterPrVusc})`
      } else if (filterScVusc) {
        filterVusc = filterScVusc
      } else {
        filterVusc = filterPrVusc
      }
      console.log('!!-!!-!! filterVusc {210227211453}\n', filterVusc); // del+
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

  render() {
    const {
      selectScOptions,
      selectScSelectedOption,
      selectPrOptions,
      selectPrSelectedOption,
      qcards,
      countAll
    } = this.state;
    return <Loader loaded={this.state.loaded}>
      {this.state.errStr
        ? <div>{this.state.errStr}</div>
        :
        <div className="uarw-container">
          <div>Всего карточек: {countAll}</div>
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
            <input type="button" onClick={this.handleClick} value="get"/>
          </div>
          <div className="qcards">
            {
              qcards.map(qcard => {
                return <QCard qcard={qcard}/>
              })
            }
          </div>
        </div>
      }
    </Loader>
  }
}
