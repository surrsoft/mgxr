import React, { Component } from 'react';
import './styles.css';
import { RandomCardViewer } from '../RandomCardViewer';
import { CardsB } from '../../api/cards-api';
import dayjs from 'dayjs';
import { MAirtable } from '../../api/airtable-api';
import { LSApiKey, randomExcept, TpCard } from '../../utils/app-utils';

export class PageNews extends Component<any, any> {

  private cardsB?: CardsB;

  constructor(props: any) {
    super(props);
    this.state = {
      card: null,
      countShowed: 0,
      countAll: 0,
      showedIxs: [],
      isLoading: true,
      isApiKeySetted: false,
      errorStr: ''
    }
  }

  async handleShow() {
    const rnd = randomExcept(this.state.countAll - 1, this.state.showedIxs);
    if (rnd !== -1) {
      const arr1 = [...this.state.showedIxs, rnd];
      if (this.cardsB) {
        const card: TpCard = this.cardsB.getByIndex(rnd);
        this.setState({
          card,
          countShowed: this.state.countShowed + 1,
          showedIxs: arr1
        })
        // ---
        const card0 = {...card, [CardsB.FIELD_SHOW_DATE_LAST]: dayjs().format('YYYY-MM-DD')};
        await CardsB.update(card.tid || '', card0);
      }
    }
  }

  async componentDidMount() {
    const apiKey = LSApiKey.apiKeyGet()
    if (apiKey) {
      try {
        this.setState({isApiKeySetted: true});
        // ---
        // [[210222113321]]
        const records = await MAirtable.recordsGet();
        this.cardsB = new CardsB(records);
        this.setState({
          isLoading: false,
          countAll: this.cardsB.countAllGet()
        });
      } catch (err: any) {
        if (err.statusCode === 401 && err.message.includes('provide valid api key')) {
          this.setState({errorStr: 'invalid Airtable API Key'})
        } else {
          throw new Error(err);
        }
      }
    }
  }

  render() {
    const {isApiKeySetted, isLoading, errorStr} = this.state;
    // ---
    return (
      <div>{
        errorStr ? <div className="app__error_string">{errorStr}</div>
          : isLoading ?
          (<div>
            {
              isApiKeySetted ?
                <div>Loading...</div> :
                <div>please provide "Airtable API Key" at "Settings"</div>
            }
          </div>)
          : <RandomCardViewer countAll={this.state.countAll} countShowed={this.state.countShowed}
                              card={this.state.card}
                              handleShow={() => this.handleShow()}/>
      }
      </div>
    )

  }
}
