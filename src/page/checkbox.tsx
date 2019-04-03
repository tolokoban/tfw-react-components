import * as React from "react"
import Checkbox from "../tfw/view/checkbox"
import Dialog from "../tfw/factory/dialog"
import Fieldset from "../tfw/view/Fieldset"

interface ICheckboxState {
    [key: string]: boolean;
}

export default class PageButton extends React.Component<{}, ICheckboxState> {
    constructor(props: {}) {
        super(props);
        this.state = {v1: false};
    }

    render() {
        return (
            <div className="page">
                <Fieldset label="Checkbox">
                    <ul>
                        <li><b>onChange(value: boolean)</b></li>
                        <li><b>label</b> (string)</li>
                        <li><b>value</b> (boolean)</li>
                    </ul>
                </Fieldset>
                <hr />
                <div>
                    <Checkbox label="Activate nuclear attack"
                        value={this.state.v1}
                        onChange={() => this.setState({ v1: !this.state.v1})}/>
                    <pre>{`<Button label="Activate nuclear attack"/>`}</pre>
                </div>
                <hr />
            </div >
        )
    }
}
