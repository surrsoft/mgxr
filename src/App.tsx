import React from 'react';
import './App.css';
import { RandomCardViewer } from './components/RandomCardViewer';
import { randomExcept } from './utils/utils';
import { Cards, CardsB } from './api/cards-api';
import { Router, Link, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { MAirtable } from './api/airtable-api';

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
      isLoading: true
    }
    this.do = this.do.bind(this);
  }

  handleShow() {
    const rnd = randomExcept(this.state.countAll - 1, this.state.showedIxs);
    if (rnd !== -1) {
      const arr1 = [...this.state.showedIxs, rnd];
      this.setState({
        card: this.cardsB ? this.cardsB.getByIndex(rnd) : {},
        countShowed: this.state.countShowed + 1,
        showedIxs: arr1
      })
    }
  }

  do() {
  }

  async componentDidMount() {
    try {
      const records = await MAirtable.recordsGet();
      console.log('!!-!!-!! 2358-10 records {210220235848}\n', records); // del+
      this.cardsB = new CardsB(records);
      this.setState({isLoading: false, countAll: this.cardsB.countAllGet()});
    } catch (err) {
      throw new Error(err);
    }
  }

  render() {
    return (
      <Router history={customHistory}>
        <div className="App">
          <div>rev.2</div>
          <Link to="/">App</Link>
          <Switch>
            <Route path="/">
              {
                this.state.isLoading ?
                  <div>Loading...</div> :
                  <RandomCardViewer countAll={this.state.countAll} countShowed={this.state.countShowed}
                                    card={this.state.card}
                                    handleShow={() => this.handleShow()}/>
              }
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
