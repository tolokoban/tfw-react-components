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
            <div className="page" >
                <Fieldset label="Button" >
                    <ul>
                        <li>
                            <code>onClick(tag: any) </code>: emitted only if the button is enabled, on click and on
                            <em>Enter</em> or <em>Space</em>.
                        </li>
                        < li ><code>label</code> (string)</li>
                        <li><code>icon</code> (string)</li>
                        <li><code>wide</code> (boolean)</li>
                        <li><code>wait</code> (boolean)</li>
                        <li><code>flat</code> (boolean)</li>
                        <li><code>small</code> (boolean)</li>
                        <li><code>warning</code> (boolean)</li>
                        <li><code>enabled</code> (boolean)</li>
                        <li><code>tag</code> (any): Any data which will be used as argument for the onClick handler.</li>
                    </ul>
                </Fieldset>
                <div>
                    <Button onClick={this.handleClick} label="label only" />
                    <Button onClick={this.handleClick} label="warning" warning={true} />
                    <Button onClick={this.handleClick} label="icon" icon="gear" />
                    <Button onClick={this.handleClick} label="warning" enabled={false} warning={true} />
                    <Button onClick={this.handleClick} label="Disabled" icon="gear" enabled={false} />
                    <pre className="thm-bgPL">{`<Button label="label only"/>
<Button label="warning" warning={true}/>
<Button label="icon" icon="gear"/>
<Button label="warning" enabled={false} warning={true}/>
<Button label="Disabled" icon="gear" enabled={false}/>`}</pre>
                </div>
                <div>
                    <Button onClick={this.handleClick} icon="refresh" />
                    <Button onClick={this.handleClick} icon="refresh" wait={true} />
                    <Button onClick={this.handleClick} icon="refresh" warning={true} />
                    <Button onClick={this.handleClick} icon="refresh" flat={true} />
                    <Button onClick={this.handleClick} icon="refresh" small={true} />
                    <pre className="thm-bgPL">{`<Button icon="refresh" />
<Button icon="refresh" wait={true} />
<Button icon="refresh" warning={true} />
<Button icon="refresh" flat={true}/>
<Button icon="refresh" small={true}/>`}</pre>
                </div>
                < hr />
                <div>
                    <Button onClick={this.handleClick} label="flat" flat={true} />
                    <Button onClick={this.handleClick} label="confirm" icon="ok" flat={true} /> `
                    <Button onClick={this.handleClick} label="Delete" flat={true} warning={true} icon="delete" />
                    <Button onClick={this.handleClick} label="confirm" enabled={false} icon="ok" flat={true} />
                    <Button onClick={this.handleClick} label="Delete" enabled={false} flat={true} warning={true} icon="delete" />
                    <pre className="thm-bgPL">{`<Button label="flat" flat={true}/>
<Button label="confirm" icon="ok" flat={true}/>
<Button label="Warning!" flat={true} warning={true}/>
<Button label="Delete" flat={true} warning={true} icon="delete"/>
<Button label="confirm" enabled={false} icon="ok" flat={true}/>
<Button label="Delete" enabled={false} flat={true} warning={true} icon="delete"/>`}</pre>
                </div>
                < hr />
                <div>
                    <Button onClick={this.handleClick} label="small" small={true} />
                    <Button onClick={this.handleClick} label="small & flat" small={true} flat={true} />
                    <Button onClick={this.handleClick} label="small" icon="wait" small={true} />
                    <Button onClick={this.handleClick} label="small" icon="wait" small={true} wait={true} />
                    <Button onClick={this.handleClick} label="small" warning={true} small={true} />
                    <pre className="thm-bgPL">{`<Button label="small" small={true}/>
<Button label="small & flat" small={true} flat={true}/>
<Button label="small" icon="wait" small={true}/>
<Button label="small" icon="wait" small={true} wait={true}/>
<Button label="small" warning={true} small={true} />`}</pre>
                </div>
                < hr />
                <div>
                    <Button onClick={this.handleClick} label="Wide Button" icon="link" wide={true} />
                    <pre className="thm-bgPL">{`<Button label="Wide Button" icon="link" wide={true} />`}</pre>
                </div>
            </div >
        )
    }
}
