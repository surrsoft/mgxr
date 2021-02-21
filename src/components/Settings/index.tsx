import React, { Component } from 'react';
import './styles.css'
import { LSApiKey } from '../../utils/utils';
import { MGXR_APP_REV } from '../../consts';

export class Settings extends Component<any, any> {
  private textInput: React.RefObject<HTMLInputElement>;

  constructor(props: any) {
    super(props);
    this.state = {
      apiKey: '',
      isLoading: true
    }
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.setState({
      apiKey: LSApiKey.apiKeyGet(),
      isLoading: false
    })
  }

  handleSave() {
    const val = this.textInput.current?.value
    if (LSApiKey.apiKeySet(val)) {
      this.setState({apiKey: val})
      alert('saved')
    } else {
      alert('invalid value')
    }
  }

  render() {
    const {apiKey, isLoading} = this.state;
    return (<div className="app__settings">
      <div>Версия приложения: {MGXR_APP_REV}</div>
      <div>
        <label>Airtable API Key: </label>
        {isLoading ? <span className="settings__loading">Loading ...</span>
          :
          (<span>
          <input className="settings__input" type="text" ref={this.textInput} defaultValue={apiKey}/>
          <button className="settings__button" onClick={() => this.handleSave()}>Save</button>
        </span>)
        }
      </div>
    </div>)
  }
}
