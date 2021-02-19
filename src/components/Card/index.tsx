import { Component } from 'react';

export class Card extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (<div>
      <div>{this.props.card.title}</div>
      <div><a href={this.props.card.url} target="_blank" rel="noopener noreferrer">{this.props.card.url}</a></div>
      <div>{this.props.card.comm}</div>
      <div>{this.props.card.body}</div>
    </div>);
  }
}
