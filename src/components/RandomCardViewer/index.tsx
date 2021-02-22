import { Component } from 'react';
import { Card } from '../Card';
import './styles.css'
import { TpCard } from '../../utils/utils';
import { CardsB } from '../../api/cards-api';


export class RandomCardViewer extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.cardHandleLinkClick.bind(this);
  }

  async cardHandleLinkClick(card: TpCard) {
    await CardsB.update(card.tid || '', card);
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
