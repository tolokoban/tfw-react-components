import * as React from "react"
import { iconsBook } from "../tfw/icons"
import Icon from "../tfw/view/icon"
import Flex from "../tfw/layout/flex"
import Combo from "../tfw/view/combo"
import Button from "../tfw/view/button"
import Fieldset from "../tfw/view/Fieldset"

interface IComboState {
    [key: string]: string;
}

export default class PageButton extends React.Component<{}, IComboState> {
    constructor(props: {}) {
        super(props);
        this.state = { month: "nov", icon: "star" };

    }

    render() {
        return (
            <div className="page">
                <Fieldset label="Combo">
                    <ul>
                        <li><code>onChange(value: string)</code></li>
                        <li><code>label</code> (string)</li>
                        <li><code>value</code> (string)</li>
                        <li><code>wide</code> (boolean): Default false.</li>
                    </ul>
                </Fieldset>
                <hr />
                <div>
                    <Flex>
                        <Combo label="Select a month"
                            value={this.state.month}
                            onChange={(month) => this.setState({ month })}>
                            <div key="jan">January</div>
                            <div key="feb">Fabruary</div>
                            <div key="mar">March</div>
                            <div key="apr">April</div>
                            <div key="may">May</div>
                            <div key="jun">June</div>
                            <div key="jul">July</div>
                            <div key="aug">August</div>
                            <div key="sep">September</div>
                            <div key="oct">October</div>
                            <div key="nov">November</div>
                            <div key="dec">December</div>
                        </Combo>
                        <span>Selected value: <b>{this.state.month}</b></span>
                        <Button label="July" icon="star" onClick={() => this.setState({ month: "jul" })} />
                    </Flex>
                    <pre className="thm-bgPL">{`<Combo label="Select a month" value="nov">
    <div key="jan">January</div>
    <div key="feb">Fabruary</div>
    ...
    <div key="dec">December</div>
</Combo>`}</pre>
                </div>
                <hr />
                <div>
                    <Flex>
                        <Combo label="List of icons"
                            value={this.state.icon}
                            onChange={(icon) => this.setState({ icon })}>{
                                Object.keys(iconsBook).map(name => (
                                    <Flex justifyContent="space-between" key={name}>
                                        <Icon size="24px" content={name} />
                                        <div>{name}</div>
                                    </Flex>
                                ))
                            }</Combo>
                        <Icon size="64px" content={this.state.icon} />
                        <Icon size="48px" animate={true} content={this.state.icon} />
                    </Flex>
                    <p>The above example shows that you can put any element as children of a Combo,
                        provided it does not exceed 32px height.</p>
                </div>
            </div>
        )
    }
}
