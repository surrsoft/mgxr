import { Component } from 'react';
import './card.css';

export class Card extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    if (!this.props.card) {
      return <div>card is null</div>
    }
    // ---
    let url = this.props.card.url;
    const ln = 47;
    if (url && url.length > ln) {
      url = url.substr(0, ln) + '...';
    }
    // ---
    return (<div className="card">
      <div className="card__title">{this.props.card.title}</div>
      <div className="card__link"><a href={this.props.card.url} target="_blank" rel="noopener noreferrer">{url}</a>
      </div>
      <div>{this.props.card.comm}</div>
      <div>{this.props.card.body}</div>
    </div>);
  }
}
