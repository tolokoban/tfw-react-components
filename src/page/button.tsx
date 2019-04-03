import * as React from "react"
import Button from "../tfw/view/button"
import Dialog from "../tfw/factory/dialog"
import Fieldset from "../tfw/view/Fieldset"

export default class PageButton extends React.Component<{}, {}> {
    handleClick() {
        Dialog.alert("The button has been clicked!");
    }

    render() {
        return (
            <div className="page">
                <Fieldset label="Input">
                    <ul>
                        <li>
                            <b>onClick(tag: any)</b>: emitted only if the button is enabled, on click and on
                            <em>Enter</em> or <em>Space</em>.
                        </li>
                        <li><b>label</b> (string)</li>
                        <li><b>icon</b> (string)</li>
                        <li><b>wide</b> (boolean)</li>
                        <li><b>wait</b> (boolean)</li>
                        <li><b>flat</b> (boolean)</li>
                        <li><b>small</b> (boolean)</li>
                        <li><b>warning</b> (boolean)</li>
                        <li><b>enabled</b> (boolean)</li>
                        <li><b>tag</b> (any): Any data which will be used as argument for the onClick handler.</li>
                    </ul>
                </Fieldset>
                <div>
                    <Button onClick={this.handleClick} label="label only" />
                    <Button onClick={this.handleClick} label="warning" warning={true} />
                    <Button onClick={this.handleClick} label="icon" icon="gear" />
                    <Button onClick={this.handleClick} label="warning" enabled={false} warning={true} />
                    <Button onClick={this.handleClick} label="Disabled" icon="gear" enabled={false} />
                    <pre>{`<Button label="label only"/>`}</pre>
                    <pre>{`<Button label="warning" warning={true}/>`}</pre>
                    <pre>{`<Button label="icon" icon="gear"/>`}</pre>
                    <pre>{`<Button label="warning" enabled={false} warning={true}/>`}</pre>
                    <pre>{`<Button label="Disabled" icon="gear" enabled={false}/>`}</pre>
                </div>
                <div>
                    <Button onClick={this.handleClick} icon="refresh" />
                    <Button onClick={this.handleClick} icon="refresh" wait={true} />
                    <Button onClick={this.handleClick} icon="refresh" warning={true} />
                    <Button onClick={this.handleClick} icon="refresh" flat={true} />
                    <Button onClick={this.handleClick} icon="refresh" small={true} />
                    <pre>{`<Button icon="refresh" />`}</pre>
                    <pre>{`<Button icon="refresh" wait={true} />`}</pre>
                    <pre>{`<Button icon="refresh" warning={true} />`}</pre>
                    <pre>{`<Button icon="refresh" flat={true}/>`}</pre>
                    <pre>{`<Button icon="refresh" small={true}/>`}</pre>
                </div>
                <hr />
                <div>
                    <Button onClick={this.handleClick} label="flat" flat={true} />
                    <Button onClick={this.handleClick} label="confirm" icon="ok" flat={true} /> `
                    <Button onClick={this.handleClick} label="Delete" flat={true} warning={true} icon="delete" />
                    <Button onClick={this.handleClick} label="confirm" enabled={false} icon="ok" flat={true} />`
                                < Button onClick={this.handleClick} label="Delete" enabled={false} flat={true} warning={true} icon="delete" />
                    <pre>{`<Button label="flat" flat={true}/>`}</pre>
                    <pre>{`<Button label="confirm" icon="ok" flat={true}/>`}</pre>
                    <pre>{`<Button label="Warning!" flat={true} warning={true}/>`}</pre>
                    <pre>{`<Button label="Delete" flat={true} warning={true} icon="delete"/>`}</pre>
                    <pre>{`<Button label="confirm" enabled={false} icon="ok" flat={true}/>`}</pre>
                    <pre>{`<Button label="Delete" enabled={false} flat={true} warning={true} icon="delete"/>`}</pre>
                </div>
                <hr />
                <div>
                    <Button onClick={this.handleClick} label="small" small={true} />
                    <Button onClick={this.handleClick} label="small & flat" small={true} flat={true} />
                    <Button onClick={this.handleClick} label="small" icon="wait" small={true} />
                    <Button onClick={this.handleClick} label="small" icon="wait" small={true} wait={true} />
                    <Button onClick={this.handleClick} label="small" warning={true} small={true} />
                    <pre>{`<Button label="small" small={true}/>`}</pre>
                    <pre>{`<Button label="small & flat" small={true} flat={true}/>`}</pre>
                    <pre>{`<Button label="small" icon="wait" small={true}/>`}</pre>
                    <pre>{`<Button label="small" icon="wait" small={true} wait={true}/>`}</pre>
                    <pre>{`<Button label="small" warning={true} small={true} />`}</pre>
                </div>
                <hr />
                <div>
                    <Button onClick={this.handleClick} label="Wide Button" icon="link" wide={true} />
                    <pre>{`<Button label="Wide Button" icon="link" wide={true} />`}</pre>
                </div>
            </div >
        )
    }
}
