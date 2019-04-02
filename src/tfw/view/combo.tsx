import * as React from "react"
import "./combo.css"
import castString from "../converter/string"
import castBoolean from "../converter/boolean"
import castStringArray from "../converter/string-array"
import Icon from "./icon"

interface IComboProps {
    label?: string;
    value?: string;
    keys?: string[];
    wide?: boolean;
    onValueChanged?: (value: string) => void;
    children: React.ReactElement<any>[];
}

export default class Combo extends React.Component<IComboProps, {}> {
    list = React.createRef<HTMLDivElement>()
    button = React.createRef<HTMLDivElement>()
    listContainer = React.createRef<HTMLDivElement>()

    keys: string[] = []
    items: React.ReactElement<HTMLDivElement> = []

    constructor(props: IComboProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
    }

    handleKeydown(event: React.KeyboardEvent) {
        console.log("[keyboard] event =", event);
    }

    handleClick(event: React.MouseEvent) {
        this.expand();
    }

    expand() {
        const index = this.keys.indexOf(this.props.value);
        const nextIndex = (index + 1) % this.keys.length;
        const slot = this.props.onValueChanged;
        if (typeof slot === 'function') {
            slot(this.keys[nextIndex]);
        }
    }

    render() {
        const p = this.props;
        const children = p.children;
        const label = castString(p.label, "").trim();
        const wide = castBoolean(p.wide, false);
        const keys = ensureGoodKeys(p.keys, children);
        const value = castString(p.value, keys[0]);
        const classes = ["tfw-view-combo", "thm-bg2", "thm-ele-button"];
        const items = children.map(item => {
            const key = item.key;
            return (<div className="item" key={key} >{item}</div>);
        });

        if (wide) classes.push("wide");

        this.keys = keys;
        this.items = items;

        const index = getIndex(keys, value);

        return (
            <button className={classes.join(" ")}
                onKeyDown={this.handleKeydown}
                onClick={this.handleClick} >
                {label.length > 0 ? <header className="thm-bgPD">{label}</header> : null}
                <div ref={this.button} className="button" >
                    <div ref={this.listContainer}
                        className="list-container"
                        style={{
                            transform: `translateY(-${32 * index}px)`
                        }}>
                        <div ref={this.list} className="tfw-view-combo-list" >{items}</div>
                    </div>
                    <div className="icon" >
                        <Icon size="24px" content="down" />
                    </div>
                </div>
            </button>
        );
    }
}

function getIndex(keys: string[], value: string) {
    const index = keys.indexOf(value);
    return Math.max(0, index);
}

/**
 * Keys must be non empty strings. If a key is not defined, it will take its index (stringified) as value.
 * And if a "key" its defined on a child, it will take precedence on anything else.
 *
 * @param  {string[]} keys
 * @param  {ReactElement[]} children
 *
 * @return {string[]}
 */
function ensureGoodKeys(keys: string[] | undefined, children: React.ReactElement<any>[]): string[] {
    const goodKeys: string[] = castStringArray(keys, []);
    const minimalLength: number = children.length;

    while (goodKeys.length < minimalLength) {
        goodKeys.push(`${goodKeys.length}`);
    }
    for (let k = 0; k < goodKeys.length; k++) {
        if (goodKeys[k].trim().length === 0) {
            goodKeys[k] = `${k}`;
        }
    }
    children.forEach((child, index) => {
        const key = child.key;
        if (typeof key === "string") {
            goodKeys[index] = key;
        } else {
            child.key = goodKeys[index];
        }
    });

    return goodKeys;
}
