import * as React from "react"
import Button from "../tfw/view/button"
import Dialog from "../tfw/factory/dialog"

export default class PageButton extends React.Component<{}, {}> {
    handleClick() {
        Dialog.alert("The button has been clicked!");
    }

    render() {
        return (
            <div>
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
            </div>
        )
    }
}
