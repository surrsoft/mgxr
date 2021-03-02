import { Component } from 'react';
import './styles.scss';
import { QCardOj } from '../../../utils/uarw/uarw-logic';
import { ToggleProgresses } from './ToggleProgresses';
import {
  UARW_PV_PROGRESS_1,
  UARW_PV_PROGRESS_2,
  UARW_PV_PROGRESS_3,
  UARW_PV_PROGRESS_4,
  UARW_PV_PROGRESS_5
} from '../../../consts-uarw';

const ReactMarkdown = require('react-markdown');

class QCardProps {
  qcard?: QCardOj
}

class QCardState {
  answerShowed: boolean = false
  progressValue: string = UARW_PV_PROGRESS_1
}

export class QCard extends Component<QCardProps, QCardState> {
  private vls: { value: string, label: string }[] = [
    {value: UARW_PV_PROGRESS_1, label: UARW_PV_PROGRESS_1},
    {value: UARW_PV_PROGRESS_2, label: UARW_PV_PROGRESS_2},
    {value: UARW_PV_PROGRESS_3, label: UARW_PV_PROGRESS_3},
    {value: UARW_PV_PROGRESS_4, label: UARW_PV_PROGRESS_4},
    {value: UARW_PV_PROGRESS_5, label: UARW_PV_PROGRESS_5},
  ];

  constructor(props: QCardProps) {
    super(props);
    this.state = {
      answerShowed: false,
      progressValue: this.props.qcard?.progress || UARW_PV_PROGRESS_1
    }
  }

  handleClick() {
    this.setState({answerShowed: true})
  }

  progressesChange = (val: string) => {
    console.log(`!!-!!-!! -> :::::::::::::: progressesChange() {210301223647}:${Date.now()}`); // del+
    console.log('!!-!!-!! val {210301223735}\n', val); // del+
    this.setState({progressValue: val})
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
          />
        </div>
      </div>
    )
  }
}
