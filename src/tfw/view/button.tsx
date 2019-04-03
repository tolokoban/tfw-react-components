import * as React from "react"
import Icon from "./icon"
import "./button.css"
import castString from "../converter/string"
import castBoolean from "../converter/boolean"

interface IButtonProps {
    label?: string;
    icon?: string;
    wide?: boolean;
    wait?: boolean;
    flat?: boolean;
    small?: boolean;
    warning?: boolean;
    enabled?: boolean;
    tag?: any;
    onClick?: (tag: any) => void;
}

export default class Button extends React.Component<IButtonProps, {}> {
    constructor(props: IButtonProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const slot = this.props.onClick;
        if (typeof slot !== 'function') return;
        slot(this.props.tag);
    }

    render() {
        const p = this.props,
            label = castString(p.label, ""),
            icon = castString(p.icon, ""),
            wide = castBoolean(p.wide, false),
            wait = castBoolean(p.wait, false),
            flat = castBoolean(p.flat, false),
            small = castBoolean(p.small, false),
            enabled = !wait && castBoolean(p.enabled, true),
            warning = castBoolean(p.warning, false),
            classes = ["tfw-view-button"];
        if (wide) classes.push("wide");
        if (flat) {
            classes.push("flat");
            classes.push(warning ? "thm-fgS" : "thm-fgP");
        }
        else {
            classes.push("thm-ele-button");
            classes.push(warning ? "thm-bgS" : "thm-bgP");
        }
        if (small) classes.push("small");
        if (label.length === 0) classes.push("floating");

        return (
            <button
                className={classes.join(" ")}
                disabled={!enabled}
                onClick={p.onClick} >
                {icon.length > 0
                    ? <Icon content={icon}
                        animate={wait}
                        size={`${small ? 20 : 28}px`} />
                    : null}
                {label.length > 0
                    ? <div className="text" >{label}</div>
                    : null}
            </button>);
    }
}
