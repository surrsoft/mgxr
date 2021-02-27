import { Component } from 'react';
import Loader from 'react-loader';
import { selectOptionToVusc, ValCount, ValLabel } from '../../utils/uarw/uarw-utils';
import Select from 'react-select';
import './styles.scss'
import { QCard } from './QCard';
import { QCardOj, UarwLogic, UarwTuples } from '../../utils/uarw/uarw-logic';
import { UARW_FE_SCOPES } from '../../consts-uarw';

interface UarwState {
  // TRUE при первом показе (до нажатия кнопки получения карточек)
  isInitiale: boolean,
  uarwTuples: UarwTuples | null,
  loaded: boolean,
  errStr: string,
  selectScOptions: object[],
  selectScSelectedOption: object | object[] | null,
  selectPrOptions: object[],
  selectPrSelectedOption: object | object[] | null,
  qcards: QCardOj[]
}


export class PageUarw extends Component<any, UarwState> {
  private uarwLogic?: UarwLogic;

  constructor(props: any) {
    super(props);
    this.state = {
      isInitiale: true,
      loaded: true,
      uarwTuples: null,
      errStr: '',
      selectScOptions: [],
      selectScSelectedOption: null,
      selectPrOptions: [],
      selectPrSelectedOption: null,
      qcards: []
    }
    this.selectScHandleChange = this.selectScHandleChange.bind(this);
    this.selectPrHandleChange = this.selectPrHandleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    this.uarwLogic = new UarwLogic()
    const {scopes, progresses} = await this.uarwLogic.scopesAndProgressesGet();
    console.log('!!-!!-!! scopes {210227202352}\n', scopes); // del+
    console.log('!!-!!-!! progresses {210227202405}\n', progresses); // del+
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
    console.log('!!-!!-!! this.state {210227132917}\n', this.state); // del+
  }

  selectPrHandleChange(selectedOption: any) {
    this.setState({selectPrSelectedOption: selectedOption})
    console.log('!!-!!-!! this.state {210227132924}\n', this.state); // del+
  }


  async handleClick() {
    try {
      let filterVusc = selectOptionToVusc(UARW_FE_SCOPES, this.state.selectScSelectedOption as { value: string })
      console.log('!!-!!-!! filterVusc {210227191510}\n', filterVusc); // del+
      // ---
      const qcardOjs = await this.uarwLogic?.qcardsGet(filterVusc);
      // ---
      this.setState({
        isInitiale: false,
        qcards: qcardOjs || [],
        loaded: true,
      })
    } catch (err) {
      this.setState({loaded: true, errStr: err.message})
    }
  }

  render() {
    const {
      isInitiale,
      selectScOptions,
      selectScSelectedOption,
      selectPrOptions,
      selectPrSelectedOption,
      qcards
    } = this.state;
    console.log('!!-!!-!! this.state {210227133042}\n', this.state); // del+
    return <Loader loaded={this.state.loaded}>
      {this.state.errStr
        ? <div>{this.state.errStr}</div>
        :
        <div className="uarw-container">
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
