import * as React from "react";
import "../theme.css";
import "./checkbox.css";


interface IBooleanSlot {
    (value: boolean): void;
}

interface ICheckboxProps {
    value?: boolean;
    label?: string;
    onChange?: IBooleanSlot
}

export default class Checkbox extends React.Component<ICheckboxProps, {}> {
    constructor(props: ICheckboxProps) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    private onChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const slot = this.props.onChange;
        if (typeof slot === 'function') {
            const checked = (event.target as HTMLInputElement).checked;
            slot(checked);
        }
    }

    render() {
        const { value, label } = this.props;
        const id = nextId();

        return (<div className="tfw-view-checkbox">
            <input
                id={id}
                type="checkbox"
                onChange={this.onChange}
                defaultChecked={value} />
            <label htmlFor={id}>{label}</label>
        </div>);
    }
}



let globalId = 0;
function nextId() {
    return `tfw-view-checkbox-${globalId++}`;
}
