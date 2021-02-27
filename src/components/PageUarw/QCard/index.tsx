import { Component } from 'react';
import './styles.scss';
import { QCardOj } from '../../../utils/uarw/uarw-logic';

class QCardProps {
  public qcard?: QCardOj
}

class QCardState {
  public answerShowed: boolean = false
}

export class QCard extends Component<QCardProps, QCardState> {
  constructor(props: QCardProps) {
    super(props);
    this.state = {
      answerShowed: false
    }
  }

  handleClick() {
    this.setState({answerShowed: true})
  }

  render() {
    const {qcard} = this.props;
    const {answerShowed} = this.state;
    return (
      <div className="qcard">
        <div className="qcard__scope">{qcard?.scope}</div>
        <div className="qcard__question">{qcard?.question}</div>
        <input className="qcard__button" type="button" value="show answer" onClick={() => this.handleClick()}/>
        {!answerShowed || <div className="qcard__answer">{qcard?.answer}</div>}
        <div className="qcard__progress">{qcard?.progress}</div>
      </div>
    )
  }
}
