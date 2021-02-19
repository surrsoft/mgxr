import React from 'react';
import './App.css';
import { RandomCardViewer } from './components/RandomCardViewer';
import { tpCards } from './utils/utils';
import _ from 'lodash';
import { Cards } from './api/cards-api';

class App extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      card: Cards.getByIndex(0)
    }
  }

  handleShow() {
    console.log(`!!-!!-!! -> :::::::::::::: handleShow() {210219195400}:${Date.now()}`); // del+
    const ct = Cards.countAllGet();
    const rnd = _.random(ct - 1);
    this.setState({
      card: Cards.getByIndex(rnd)
    })
  }

  render() {
    return (
      <div className="App">
        <RandomCardViewer card={this.state.card} handleShow={() => this.handleShow()}/>
      </div>
    );
  }
}

export default App;
