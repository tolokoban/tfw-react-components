import React from "react"
import castArray from "../converter/array"
import "./stack.css"

interface IStackProps {
    value: string;
    children: React.ReactElement<any>[]
}

export default class Stack extends React.Component<IStackProps, {}> {
    render() {
        const children = castArray(this.props.children);
        return (
            <div className="tfw-layout-stack">{
                children.filter(elem => elem.key == this.props.value)
            }</div>
        );
    }
}
