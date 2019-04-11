import React from "react"
import castArray from "../converter/array"
import castString from "../converter/string"
import castBoolean from "../converter/boolean"
import Button from "../view/button"
import "./sidemenu.css"

interface ISidemenuProps {
    show?: boolean;
    head?: string;
    menu?: React.ReactElement<HTMLDivElement>;
    body?: React.ReactElement<HTMLDivElement>;
    classes?: string[] | string;
    onShowChanged?: (isMenuVisible: boolean) => void;
}

export default class Sidemenu extends React.Component<ISidemenuProps, {}> {
    constructor(props: ISidemenuProps) {
        super(props);
        this.handleShowChanged = this.handleShowChanged.bind(this);
    }

    handleShowChanged() {
        const handler = this.props.onShowChanged;
        if (typeof handler !== 'function') return;
        handler(!castBoolean(this.props.show, window.innerWidth > 480));
    }

    render() {
        const show = castBoolean(this.props.show, window.innerWidth > 480);
        const head = castString(this.props.head, "");
        const classes = ["tfw-layout-sidemenu thm-bg0"].concat(castArray(this.props.classes));
        if (show) classes.push("show");

        return (
            <div className={classes.join(" ")}>
                <div className="body thm-bg0">{this.props.body}</div>
                <div className="menu thm-ele-nav thm-bg1">
                    <header className="thm-ele-nav thm-bgPD">{head}</header>
                    <menu>{this.props.menu}</menu>
                </div>
                <div className="icon thm-bgPD">
                    <Button icon="menu" flat={true} onClick={this.handleShowChanged} />
                </div>
            </div>
        );
    }
}
