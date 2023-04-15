import React, { Component } from 'react';
import './styles.css';
import { RandomCardViewer } from '../RandomCardViewer';
import { CardsB } from '../../api/cards-api';
import dayjs from 'dayjs';
import { MAirtable } from '../../api/airtable-api';
import { randomExcept } from '../../utils/app-utils';
import { LSApiKey } from '../../utils/LSApiKeyCls';
import { CardCls } from '../../utils/CardCls';

export class PageNews2 extends Component<any, any> {

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
      errorStr: '',
    };
  }

  async handleShow() {
    const randomIndex = randomExcept(this.state.countAll - 1, this.state.showedIxs);
    if (randomIndex !== -1) {
      const arr1 = [...this.state.showedIxs, randomIndex];
      if (this.cardsB) {
        const card: CardCls = this.cardsB.getByIndex(randomIndex);
        this.setState({
          card,
          countShowed: this.state.countShowed + 1,
          showedIxs: arr1,
        });
        // ---
        const card0 = { ...card, [CardsB.FIELD_SHOW_DATE_LAST]: dayjs().format('YYYY-MM-DD') };
        CardsB.update(card.tid || '', card0).catch((e: any) => {
          console.log(`230415124650 - при обновлении карточки произошла ошибка; err [${e}]`);
        });
      }
    }
  }

  async componentDidMount() {
    const apiKey = LSApiKey.apiKeyGet();
    if (apiKey) {
      try {
        this.setState({ isApiKeySetted: true });
        // --- получаем вообще ВСЕ записи
        // [[210222113321]]
        const records = await MAirtable.recordsGet();
        // ---
        console.log('!!-!!-!!  records {230415121912}\n', records); // del+
        this.cardsB = new CardsB(records);
        this.setState({
          isLoading: false,
          countAll: this.cardsB.countAllGet(),
        });
      } catch (err: any) {
        if (err.statusCode === 401 && err.message.includes('provide valid api key')) {
          this.setState({ errorStr: 'invalid Airtable API Key' });
        } else {
          throw new Error(err);
        }
      }
    }
  }

  render() {
    const { isApiKeySetted, isLoading, errorStr } = this.state;
    // ---
    return (
      <div>{
        errorStr
          ? <div className="app__error_string">{errorStr}</div>
          : isLoading
            ?
            (<div>
              {
                isApiKeySetted ?
                  <div>Loading...</div> :
                  <div>please provide "Airtable API Key" at "Settings"</div>
              }
            </div>)
            :
            <RandomCardViewer
              countAll={this.state.countAll}
              countShowed={this.state.countShowed}
              card={this.state.card}
              handleShow={() => this.handleShow()}
            />
      }
      </div>
    );

  }
}
