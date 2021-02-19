import { Component } from 'react';
import { Card } from '../Card';

export class RandomCardViewer extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (<div className="rc-viewer">
      <button onClick={this.props.handleShow}>Show</button>
      <Card card={this.props.card}/>
    </div>);
  }
}
