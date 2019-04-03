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
        this.state = { v1: false, v2: true };
    }

    render() {
        return (
            <div className="page">
                <Fieldset label="Checkbox">
                    <ul>
                        <li><code>onChange(value: boolean)</code></li>
                        <li><code>label</code> (string)</li>
                        <li><code>value</code> (boolean): Default false.</li>
                        <li><code>wide</code> (boolean): Default false.</li>
                        <li><code>back</code> (boolean): If true, the button is at the right. Default false.</li>
                    </ul>
                </Fieldset>
                <hr />
                <div>
                    <Checkbox label="Nuclear attack activated"
                        value={this.state.v1}
                        onChange={() => this.setState({ v1: !this.state.v1 })} />
                    <Checkbox label="Viral attack activated"
                        value={this.state.v2}
                        onChange={() => this.setState({ v2: !this.state.v2 })} />
                    <pre className="thm-bgPL">{`<Button label="Nuclear attack activated"/>
<Button label="Viral attack activated"/>`}</pre>
                </div>
                <hr />
                <div>
                    <Checkbox label="Nuclear attack activated"
                        wide={true} back={true}
                        value={this.state.v1}
                        onChange={() => this.setState({ v1: !this.state.v1 })} />
                    <Checkbox label="Viral attack activated"
                        wide={true} back={true}
                        value={this.state.v2}
                        onChange={() => this.setState({ v2: !this.state.v2 })} />
                    <pre className="thm-bgPL">{`<Button wide={true} back={true} label="Nuclear attack activated"/>
<Button wide={true} back={true} label="Viral attack activated"/>`}</pre>
                </div>
            </div >
        )
    }
}
