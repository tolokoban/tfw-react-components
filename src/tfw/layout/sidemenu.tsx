import React from "react"
import castString from "../converter/string"
import castBoolean from "../converter/boolean"
import Button from "../view/button"
import "./sidemenu.css"

interface ISidemenuProps {
    show?: boolean;
    head?: string;
    menu?: React.ReactElement<HTMLDivElement>;
    body?: React.ReactElement<HTMLDivElement>;
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

        return (
            <div className="tfw-layout-sidemenu">
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
