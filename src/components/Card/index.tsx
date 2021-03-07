import { Component } from 'react';
import './card.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';
import { TpCard } from '../../utils/app-utils';

export interface CardProps {
  card: TpCard,
  handleLinkClick: (card: TpCard) => void
}

function DateFieldShow(name: string, dateSt?: string) {
  return (<div>
    {name}: {dateSt ?
    (`${dateSt} (прошло дней: ${dayjs().diff(dateSt, 'day')})`)
    : '-'}
  </div>)
}

export class Card extends Component<CardProps, any> {

  constructor(props: CardProps) {
    super(props);
    this.handleLinkPress = this.handleLinkPress.bind(this);
    dayjs.extend(relativeTime)
    dayjs.extend(isBetween)
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
    // ---
    return (<div className="card">
      <div className="card__title">{card.title}</div>
      <div className="card__link">
        <a
          href={card.url}
          onClick={this.handleLinkPress}
          target="_blank"
          rel="noopener noreferrer">
          {card.url}
        </a>
      </div>
      <div>{card.comm}</div>
      <div>{card.body}</div>
      <div className="card__infos">
        <div>Число переходов: {card.trans_count}</div>
        {DateFieldShow('Дата последнего перехода: ', card.trans_date_last)}
        {DateFieldShow('Дата последнего показа: ', card.show_date_last)}
      </div>
    </div>);
  }

}
