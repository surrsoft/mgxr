import { Component } from 'react';
import { Card } from '../Card';
import './styles.css'


export class RandomCardViewer extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (<div className="rc-viewer">
      <div>Показано: {this.props.countShowed} / {this.props.countAll}</div>
      <button className="rc-viewer__button" onClick={this.props.handleShow}>Show</button>
      {this.props.card ? <div className="rc-viewer__card"><Card card={this.props.card}/></div> : null}
    </div>);
  }
}
