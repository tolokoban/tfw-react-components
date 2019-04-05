import * as React from "react"
import Icon from "../tfw/view/icon"
import Dialog from "../tfw/factory/dialog"
import Fieldset from "../tfw/view/Fieldset"

import Flex from "../tfw/layout/flex"

import { iconsBook } from "../tfw/icons";

interface IIconState {
    [key: string]: boolean;
}

export default class PageButton extends React.Component<{}, IIconState> {
    constructor(props: {}) {
        super(props);
        this.state = { v1: false, v2: true };
    }

    render() {
        return (
            <div className="page">
                <Fieldset label="Icon">
                    <ul>
                        <li><code>onClick()</code></li>
                        <li><code>content</code> (string|object)</li>
                        <li><code>size</code> (string|number): Default "28px".</li>
                        <li><code>animate</code> (boolean): Default false.</li>
                    </ul>
                </Fieldset>
                <hr />
                <div>
                    <Flex justifyContent="flex-start">
                        <div className="thm-bg0"><Icon /></div>
                        <div className="thm-bg1"><Icon /></div>
                        <div className="thm-bg2"><Icon /></div>
                        <div className="thm-bg3"><Icon /></div>
                        <div className="thm-bgPD"><Icon /></div>
                        <div className="thm-bgP"><Icon /></div>
                        <div className="thm-bgPL"><Icon /></div>
                        <div className="thm-bgSD"><Icon /></div>
                        <div className="thm-bgS"><Icon /></div>
                        <div className="thm-bgSL"><Icon /></div>
                    </Flex>
                    <pre className="thm-bgPL">{`<Icon/>`}</pre>
                </div>
                <hr />
                <div>
                    <Flex justifyContent="flex-start">
                        <Icon content="flag-en" />
                        <Icon content="flag-en" flipH={true} />
                        <Icon content="flag-en" flipV={true} />
                        <Icon content="flag-en" flipV={true} flipH={true} />
                        <Icon content="flag-en" rotate={15} />
                        <Icon content="flag-en" rotate={40} flipH={true} />
                        <Icon content="flag-en" rotate={65} flipV={true} />
                        <Icon content="flag-en" rotate={90} flipV={true} flipH={true} />
                    </Flex>
                    <pre className="thm-bgPL">{`<Icon content="flag-en"/>
<Icon content="flag-en" flipH={true} />
<Icon content="flag-en" flipV={true} />
<Icon content="flag-en" flipV={true} flipH={true} />
<Icon content="flag-en" rotate={15} />
<Icon content="flag-en" rotate={40} flipH={true} />
<Icon content="flag-en" rotate={65} flipV={true} />
<Icon content="flag-en" rotate={90} flipV={true} flipH={true} />`}</pre>
                </div>
                <hr />
                <p>Here is the list of all dfault icons. Click on the one you want details for.</p>
                <Flex>{
                    Object.keys(iconsBook).map(name => (
                        <Icon key={name} content={name} size="32px" onClick={() => showDetails(name)} />
                    ))
                }</Flex>
            </div >
        )
    }
}


function showDetails(name: string) {
    Dialog.show({
        title: name,
        icon: name,
        content: (<div>
            <Flex>
                <Icon size="16px" content={name} />
                <Icon size="28px" content={name} />
                <Icon size="32px" content={name} />
                <Icon size="64px" content={name} />
                <Icon size="128px" content={name} />
            </Flex>
            <hr />
            {
                JSON.stringify(iconsBook[name], null, "  ").split("\n").map((line, index) => (
                    <div key={`L${index}`}>
                        <code style={{
                            paddingLeft: `${countLeadingSpaces(line)}em`
                        }}>{line}</code>
                    </div>
                ))
            }
        </div>)
    })
}


function countLeadingSpaces(line: string) {
    let i = 0;
    for (; i < line.length; i++) {
        if (line.charAt(i) !== ' ' && line.charAt(i) !== '\t') break;
    }
    return i;
}
