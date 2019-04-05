import * as React from "react"
import Icon from "../tfw/view/icon"
import Combo from "../tfw/view/combo"
import Input from "../tfw/view/input"
import Checkbox from "../tfw/view/checkbox"
import Fieldset from "../tfw/view/Fieldset"

import Dialog from "../tfw/factory/dialog"

import Flex from "../tfw/layout/flex"

import { iconsBook } from "../tfw/icons";

interface IIconState {
    content: string;
    size: string;
    flipH: boolean;
    flipV: boolean;
    animate: boolean;
    rotate: number;
}

export default class PageButton extends React.Component<{}, IIconState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            content: "counter",
            size: "28px",
            flipH: false,
            flipV: false,
            animate: false,
            rotate: 0
        };
    }

    render() {
        const s = this.state;
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
                <div>
                    <Flex justifyContent="center">
                        <Icon content={s.content}
                            size={s.size}
                            animate={s.animate}
                            flipH={s.flipH}
                            flipV={s.flipV}
                            rotate={s.rotate} />
                    </Flex>
                    <Flex justifyContent="space-around">
                        <Combo label="content"
                            value={s.content}
                            onChange={content => this.setState({ content })}>{
                                Object.keys(iconsBook).map(name => (
                                    <Flex justifyContent="space-between" key={name}>
                                        <Icon size="24px" content={name} />
                                        <div>{name}</div>
                                    </Flex>
                                ))
                            }</Combo>
                        <Combo label="size" value={s.size}
                            onChange={size => this.setState({ size })}>
                            <div key="14px">14px</div>
                            <div key="28px">28px</div>
                            <div key="56px">56px</div>
                            <div key="4rem">4rem</div>
                            <div key="50%">50%</div>
                            <div key="40vmin">40vmin</div>
                        </Combo>
                        <Checkbox label="flipH" value={s.flipH}
                            onChange={flipH => this.setState({ flipH })} />
                        <Checkbox label="flipV" value={s.flipV}
                            onChange={flipV => this.setState({ flipV })} />
                        <Checkbox label="animate" value={s.animate}
                            onChange={animate => this.setState({ animate })} />
                        <Input label="rotate" value={s.rotate} type="number"
                            onChange={rotate => this.setState({ rotate })} />
                    </Flex>
                </div>
                <hr />
                <p>Here is the list of all dfault icons. Click on the one you want details for.</p>
                <Flex justifyContent="center">{
                    Object.keys(iconsBook).map(name => (
                        <Icon key={name} content={name} size="32px" onClick={() => showDetails(name)} />
                    ))
                }</Flex>
                <hr />
                <p>You can find more icons here: <a href="https://materialdesignicons.com/">Material Design Icons</a>.</p>
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
