import { Component } from 'react';
import './styles.scss';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { UARW_PROGRESSES } from '../../../../consts-uarw';
import ClipLoader from "react-spinners/ClipLoader";

class Props {
  vls: { value: string, label: string }[] = []
  currValue: string = UARW_PROGRESSES.P1
  onChange?: (val: string) => void = () => {
  }
  disable: boolean = false
}

class State {

}

export class ToggleProgresses extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return <div className="cls2255-container">
      <ToggleButtonGroup
        name="value"
        type="radio"
        value={this.props.currValue}
        onChange={this.props.onChange}
        size="sm"
      >
        {
          this.props.vls.map((vl, index) => {
            return <ToggleButton key={index} value={vl.value} disabled={this.props.disable}>
              {vl.label}
            </ToggleButton>
          })
        }
      </ToggleButtonGroup>
      <div className="cls2255-spinner">
        <ClipLoader loading={this.props.disable} size={16}/>
      </div>
    </div>
  }
}
