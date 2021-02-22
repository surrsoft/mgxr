import React from 'react';
import './App.css';
import { RandomCardViewer } from './components/RandomCardViewer';
import { LSApiKey, randomExcept, TpCard } from './utils/utils';
import { CardsB } from './api/cards-api';
import { Link, Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { MAirtable } from './api/airtable-api';
import { Settings } from './components/Settings';
import { isEmpty as _isEmpty } from 'lodash';
import dayjs from 'dayjs';

const customHistory = createBrowserHistory();

MAirtable.init();


class App extends React.Component<any, any> {
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
    this.do = this.do.bind(this);
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
        console.log('!!-!!-!! card0 {210222121922}\n', card0); // del+
        await CardsB.update(card.tid || '', card0);
      }
    }
  }

  do() {
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
      } catch (err) {
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
    return (
      <Router history={customHistory}>
        <div className="App">
          <div className="appRoutes">
            <Link to="/mgxr">Главная</Link>
            <Link to="/settings">Настройки</Link>
          </div>
          <Switch>
            <Route path={["/", "/mgxr"]} exact>
              {
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
            </Route>
            <Route path="/settings">
              <Settings/>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
