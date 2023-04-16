import React, { Component } from 'react';
import './styles.css'
import { MGXR_APP_REV } from '../../consts';
import { ApiKeyStorageCls } from '../../utils/ApiKeyStorageCls';

export class PageSettings extends Component<any, any> {
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
      apiKey: ApiKeyStorageCls.apiKeyGet(),
      isLoading: false
    })
  }

  handleSave() {
    const val = this.textInput.current?.value
    if (ApiKeyStorageCls.apiKeySet(val)) {
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
      <div>см. <a href="https://airtable.com/create/apikey" target="_blank">https://airtable.com/create/apikey</a></div>
    </div>)
  }
}
