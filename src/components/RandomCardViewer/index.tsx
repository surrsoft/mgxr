import { Component } from 'react';
import { Card } from '../Card';
import './styles.css'
import { TpCard } from '../../utils/utils';
import { CardsB } from '../../api/cards-api';
import dayjs from 'dayjs';


export class RandomCardViewer extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.cardHandleLinkClick.bind(this);
  }

  async cardHandleLinkClick(card: TpCard) {
    const card0 = {
      ...card,
      [CardsB.FIELD_TRANS_DATE_LAST]: dayjs(Date.now()).format('YYYY-MM-DD')
    }
    await CardsB.update(card.tid || '', card0);
  }

  render() {
    return (<div className="rc-viewer">
      <div>Показано: {this.props.countShowed} / {this.props.countAll}</div>
      <button className="rc-viewer__button" onClick={this.props.handleShow}>Show</button>
      {
        this.props.card ?
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
