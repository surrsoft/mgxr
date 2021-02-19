import React from 'react';
import './App.css';
import { RandomCardViewer } from './components/RandomCardViewer';
import { randomExcept } from './utils/utils';
import { Cards } from './api/cards-api';

class App extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      card: null,
      countShowed: 0,
      countAll: Cards.countAllGet(),
      showedIxs: []
    }
  }

  handleShow() {
    console.log(`!!-!!-!! -> :::::::::::::: handleShow() {210219195400}:${Date.now()}`); // del+
    console.log('!!-!!-!! this.state.showedIxs {210219205259}\n', this.state.showedIxs); // del+
    const rnd = randomExcept(this.state.countAll - 1, this.state.showedIxs);
    console.log('!!-!!-!! rnd {210219204707}\n', rnd); // del+
    if (rnd !== -1) {
      const arr1 = [...this.state.showedIxs, rnd];
      console.log('!!-!!-!! arr1 {210219205411}\n', arr1); // del+
      this.setState({
        card: Cards.getByIndex(rnd),
        countShowed: this.state.countShowed + 1,
        showedIxs: arr1
      })
    }
  }

  render() {
    return (
      <div className="App">
        <RandomCardViewer countAll={this.state.countAll} countShowed={this.state.countShowed} card={this.state.card}
                          handleShow={() => this.handleShow()}/>
      </div>
    );
  }
}

export default App;
