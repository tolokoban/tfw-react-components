import * as React from "react"
import Flex from "../tfw/layout/flex"
import Input from "../tfw/view/input"
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
                <Fieldset label="Input" >
                    <ul>
                        <li><code>label</code> (string)</li>
                        <li><code>delay</code> (number): Number of milliseconds to wait after
                        the last keystroke before sending the <i>onChange</i> event.</li>
                        <li><code>size</code> (number)</li>
                        <li><code>focus</code> (boolean)</li>
                        <li><code>type</code> (string): "text", "password", "submit", "color", "date",
                            "datetime-local", "email", "month", "number", "range",
                            "search", "tel", "time", "url", "week".</li>
                        <li><code>validator(value: string)</code> (boolean|string)</li>
                        <li><code>onChange(value: string)</code></li>
                    </ul>
                </Fieldset>
                <Flex justifyContent="space-between">
                    <Input label="What's your name?" />
                    <pre className="thm-bgPL">{`<Input label="What's your name?" />`}</pre>
                </Flex>
            </div >
        )
    }
}
