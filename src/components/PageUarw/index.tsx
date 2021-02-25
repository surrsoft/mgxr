import { Component } from 'react';
import Loader from 'react-loader';
import { HoggConnectionAirtable } from '../../api/hogg/connections/HoggConnectionAirtable';
import { LSApiKey } from '../../utils/utils';
import { UARW_CONF_AIRTABLE_DB_NAME, UARW_CONF_AIRTABLE_TABLE_NAME } from '../../consts-uarw';
import { HoggOffsetCount } from '../../api/hogg/connections/HoggOffsetCount';

export class PageUarw extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loaded: false,
      data: null,
      errStr: ''
    }
  }

  async componentDidMount() {
    try {
      const connection = new HoggConnectionAirtable();
      const apiKey = LSApiKey.apiKeyGet() || '';
      connection.init({apiKey});
      const data = await connection
        .db(UARW_CONF_AIRTABLE_DB_NAME)
        .table(UARW_CONF_AIRTABLE_TABLE_NAME)
        .query(new HoggOffsetCount(true))
      console.log('!!-!!-!! data {210226000136}\n', data); // del+
      this.setState({
        data, loaded: true
      })
    } catch (err) {
      this.setState({loaded: true, errStr: err.message})
    }
  }

  render() {
    return (
      <Loader loaded={this.state.loaded}>
        {this.state.errStr
          ? <div>this.state.errStr</div>
          : <div>Uarw</div>
        }
      </Loader>
    )
  }
}
