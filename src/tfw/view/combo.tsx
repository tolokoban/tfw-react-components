import * as React from "react"
import "./combo.css"
import castString from "../converter/string"
import castBoolean from "../converter/boolean"
import castStringArray from "../converter/string-array"
import Icon from "./icon"
import Gesture from "../gesture"
import EscapeHandler from "../escape-handler"

interface IComboProps {
    label?: string;
    value?: string;
    keys?: string[];
    wide?: boolean;
    onChange?: (value: string) => void;
    children: React.ReactElement<any>[];
}

export default class Combo extends React.Component<IComboProps, {}> {
    list = React.createRef<HTMLDivElement>()
    button = React.createRef<HTMLDivElement>()

    keys: string[] = []

    constructor(props: IComboProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event: React.MouseEvent) {
        this.expand();
    }

    expand() {
        if (this.keys.length < 3) {
            // With two items, clicking will immediatly switch to the next one.
            const index = this.keys.indexOf(this.props.value || "");
            const nextIndex = (index + 1) % this.keys.length;
            const slot = this.props.onChange;
            if (typeof slot === 'function') {
                slot(this.keys[nextIndex]);
            }
            return;
        }

        const list = this.list.current;
        const button = this.button.current;
        if (!list || !button) return;
        let { left, top, height } = list.getBoundingClientRect();
        const { width } = button.getBoundingClientRect();
        height = Math.min(height, window.innerHeight - 32);
        if (top + height > window.innerHeight) {
            top -= 32 * Math.ceil(window.innerHeight - top - height / 32);
        }
        const screen = document.createElement("div");
        screen.className = "tfw-view-combo-screen";
        const bigList = document.createElement("div");
        bigList.className = "thm-ele-nav thm-bg3";
        bigList.innerHTML = list.innerHTML;
        if (top < 0) {
            top += 32 * Math.ceil(-top / 32);
        }
        bigList.style.top = `${top}px`;
        bigList.style.left = `${left}px`;
        bigList.style.width = `${width}px`;
        bigList.style.height = `${height}px`;
        screen.appendChild(bigList);
        document.body.appendChild(screen);
        EscapeHandler.add(() => document.body.removeChild(screen));
        Gesture(screen).on({ tap: () => EscapeHandler.fire() });
        Gesture(bigList).on({
            tap: (evt) => {
                if (!evt || typeof evt.y === 'undefined') return;
                const scroll = bigList.scrollTop;
                const index = Math.floor((evt.y + scroll) / 32);
                const value = this.keys[index];
                EscapeHandler.fire()
                requestAnimationFrame(() => {
                    if (typeof this.props.onChange === 'function') {
                        this.props.onChange(value)
                    }
                });
            }
        });
    }

    render() {
        const p = this.props;
        const children = p.children;
        const label = castString(p.label, "").trim();
        const wide = castBoolean(p.wide, false);
        const keys = ensureGoodKeys(p.keys, children);
        const value = castString(p.value, keys[0]);
        const classes = ["tfw-view-combo", "thm-bg3", "thm-ele-button"];
        const items = children.map(item => {
            const key = item.key;
            let className = "item";
            if (key === p.value) className += " selected";
            return (<div className={className} key={key} > {item} </div>);
        });

        if (wide) classes.push("wide");

        this.keys = keys;

        const index = getIndex(keys, value);

        return (
            <button className={classes.join(" ")}
                onClick={this.handleClick}>
                {label.length > 0 ? <header className="thm-bgPD">{label}</header> : null}
                <div ref={this.button} className="button">
                    <div className="list-container"
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


function onTap(elem: HTMLElement, handler: () => void) {
    const slot = (event) => {
        event.preventDefault();
        event.stopPropagation();
        elem.removeEventListener("mousedown", slot);
        elem.removeEventListener("touchdown", slot);
        handler();
    };
    elem.addEventListener("mousedown", slot, false);
    elem.addEventListener("touchdown", slot, false);
}
