import * as React from "react";
import "./checkbox.css";

import castString from "../converter/string"
import castBoolean from "../converter/boolean"


interface IBooleanSlot {
    (value: boolean): void;
}

interface ICheckboxProps {
    value?: boolean;
    label?: string;
    wide?: boolean;
    reverse?: boolean;
    onChange?: IBooleanSlot
}

export default class Checkbox extends React.Component<ICheckboxProps, {}> {
    constructor(props: ICheckboxProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    private handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const slot = this.props.onChange;
        if (typeof slot === 'function') {
            const value = castBoolean(this.props.value, false);
            slot(!value);
        }
    }

    render() {
        const label = castString(this.props.label, "");
        const value = castBoolean(this.props.value, false);
        const wide = castBoolean(this.props.wide, false);
        const reverse = castBoolean(this.props.reverse, false);
        const classes = ["tfw-view-checkbox"];
        if (value) classes.push("ok");
        if (wide) classes.push("wide");
        if (reverse) classes.push("reverse");

        return (<button className={classes.join(" ")} onClick={this.handleChange} >
            <div className="pin" >
                <div className={`thm-ele-button bar ${value ? "thm-bgSL" : "thm-bg1"}`}> </div>
                <div className={`thm-ele-button btn ${value ? "thm-bgS" : "thm-bg0"}`
                }> </div>
            </div>
            <label >{label}</label>
        </button>);
    }
}
