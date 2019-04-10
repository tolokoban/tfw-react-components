import * as React from "react"
import castArray from "../converter/array"
import castFunction from "../converter/function"
import castBoolean from "../converter/boolean"
import TouchableBehavior from "../behavior/touchable"

interface ITouchableProps {
    enabled?: boolean;
    onClick?: ()=>void;
    classes?: string[];
    children?: React.ReactElement<any>|React.ReactElement<any>[];
}

export default class Touchable extends React.Component<ITouchableProps, {}> {
    readonly touchable: TouchableBehavior;
    private ref = React.createRef();

    constructor(props: ITouchableProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.touchable = new TouchableBehavior({onTap: this.handleClick});
    }

    componentDidMount() {
        const element = this.ref.current;
        if (!element) return;
        this.touchable.element = element;
    }

    handleClick() {
        const handler = this.props.onClick;
        if( typeof handler === 'function') {
            handler();
        }
    }

    render() {
        const p = this.props;
        const enabled = castBoolean(p.enabled, true);
        const classes = castArray(p.classes);
        return <div ref={this.ref} className={classes.join(" ")}>{
            p.children
        }</div>
    }
}
