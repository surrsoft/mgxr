import { Component } from 'react';
import { Card } from '../Card';
import './styles.css'
import { CardsCls } from '../../entries/CardsCls';
import dayjs from 'dayjs';
import { CardFtType } from '../../types/CardFtType';


export class CardViewContainer extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.cardHandleLinkClick.bind(this);
  }

  async cardHandleLinkClick(card: CardFtType) {
    const card0 = {
      ...card,
      [CardsCls.FIELD_TRANS_DATE_LAST]: dayjs(Date.now()).format('YYYY-MM-DD')
    }
    await CardsCls.update(card.tid || '', card0);
  }

  render() {
    return (<div className="rc-viewer">
      <div>Показано: {this.props.countShowed} / {this.props.countAll}</div>
      <button className="rc-viewer__button" onClick={this.props.handleShow}>Show</button>
      {
        this.props.card
          ?
          <div className="rc-viewer__card">
            <Card
              card={this.props.card}
              handleLinkClick={this.cardHandleLinkClick}
            />
          </div>
          : null
      }
    </div>);
  }
}
