import { Component } from 'react';
import './card.css';
import { TpCard } from '../../utils/utils';

export interface CardProps {
  card: TpCard,
  handleLinkClick: (card: TpCard) => void
}

export class Card extends Component<CardProps, any> {

  constructor(props: CardProps) {
    super(props);
    this.handleLinkPress = this.handleLinkPress.bind(this);
  }

  // @ts-ignore
  async handleLinkPress(e) {
    const {card, handleLinkClick} = this.props;
    handleLinkClick(card);
  }

  render() {
    const {card} = this.props;
    if (!card) {
      return <div>card is null</div>
    }
    // --- обрезка отображаемого url
    let urlName = card.url;
    const ln = 47;
    if (urlName && urlName.length > ln) {
      urlName = urlName.substr(0, ln) + '...';
    }
    // ---
    return (<div className="card">
      <div className="card__title">{card.title}</div>
      <div className="card__link">
        <a
          href={card.url}
          onClick={this.handleLinkPress}
          target="_blank"
          rel="noopener noreferrer">
          {urlName}
        </a>
      </div>
      <div>{card.comm}</div>
      <div>{card.body}</div>
      <div className="card__infos">
        <div>Число переходов: {card.trans_count}</div>
      </div>
    </div>);
  }

}
