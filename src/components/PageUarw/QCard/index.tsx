import { Component } from 'react';
import './styles.scss';
import { QCardOj } from '../../../utils/uarw/uarw-logic';
import { ToggleProgresses } from './ToggleProgresses';
import {
  UARW_PROGRESSES,
} from '../../../consts-uarw';

const ReactMarkdown = require('react-markdown');

class QCardProps {
  qcard?: QCardOj
  qcardProgressChange?: (qcardTid: string, newProgress: UARW_PROGRESSES) => Promise<boolean>
}

class QCardState {
  answerShowed: boolean = false
  progressValue: string = UARW_PROGRESSES.P1
  progressDisable: boolean = false
}

export class QCard extends Component<QCardProps, QCardState> {
  private vls: { value: string, label: string }[] = [
    {value: UARW_PROGRESSES.P1, label: UARW_PROGRESSES.P1},
    {value: UARW_PROGRESSES.P2, label: UARW_PROGRESSES.P2},
    {value: UARW_PROGRESSES.P3, label: UARW_PROGRESSES.P3},
    {value: UARW_PROGRESSES.P4, label: UARW_PROGRESSES.P4},
    {value: UARW_PROGRESSES.P5, label: UARW_PROGRESSES.P5},
  ];

  constructor(props: QCardProps) {
    super(props);
    this.state = {
      answerShowed: false,
      progressValue: this.props.qcard?.progress || UARW_PROGRESSES.P1,
      progressDisable: false
    }
  }

  handleClick() {
    this.setState({answerShowed: true})
  }

  progressesChange = async (val: string) => {
    console.log(`!!-!!-!! -> :::::::::::::: progressesChange() {210301223647}:${Date.now()}`); // del+
    console.log('!!-!!-!! val {210301223735}\n', val); // del+
    console.log('!!-!!-!! qcard {210302214154}\n', this.props.qcard); // del+
    if (this.props.qcardProgressChange) {
      this.setState({progressDisable: true});
      const res = await this.props.qcardProgressChange(this.props.qcard?.tid || '', val as UARW_PROGRESSES);
      console.log('!!-!!-!! res {210303002044}\n', res); // del+
      this.setState({progressDisable: false});
      if (res) {
        this.setState({progressValue: val})
      }
    }
  }

  render() {
    const {qcard} = this.props;
    const {answerShowed} = this.state;
    return (
      <div className="qcard">
        <div className="qcard__scope">{qcard?.scope}</div>
        <ReactMarkdown className="qcard__question">{qcard?.question}</ReactMarkdown>
        <input className="qcard__button" type="button" value="show answer" onClick={() => this.handleClick()}/>
        {!answerShowed || <ReactMarkdown className="qcard__answer">{this.props.qcard?.answer}</ReactMarkdown>}
        <div className="toggle-progresses">
          <ToggleProgresses
            vls={this.vls}
            currValue={this.state.progressValue}
            onChange={this.progressesChange}
            disable={this.state.progressDisable}
          />
        </div>
        {this.props.qcard?.errMsg && <div className="err-msg">{this.props.qcard?.errMsg}</div>}
      </div>
    )
  }
}
