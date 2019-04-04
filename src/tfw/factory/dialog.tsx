export default {
    /**
     * [gDialogs description]
     *
     * @type {Array}
     */
    alert
};

import * as React from "react"
import ReactDOM from 'react-dom'
import EscapeHandler from "../escape-handler"
import "./dialog.css"

import Button from "../view/button"

import Intl from "../intl";
const _ = Intl.make(require("./dialog.yaml"));

interface IOptions {
    onClose?: () => void;
}

class Dialog {
    private _screen: HTMLElement;

    constructor(private _options: IOptions = {}) {
        const screen = document.createElement("div");
        screen.className = "tfw-factory-dialog";
        document.body.appendChild(screen);
        this._screen = screen;
        this.hide = this.hide.bind(this);
        EscapeHandler.add(() => this._hide());
    }

    show(body: React.Component) {
        ReactDOM.render(body, this._screen);
        setTimeout(() => this._screen.classList.add("show"), 10);
    }

    hide() {
        EscapeHandler.fire();
    }

    _hide() {
        const screen = this._screen;
        screen.classList.remove("show");
        setTimeout(() => {
            document.body.removeChild(screen);
        }, 200);
        const onClose = this._options.onClose;
        if (typeof onClose === 'function') {
            requestAnimationFrame(onClose);
        }
    }
}

function alert(message: string, onClose: () => void | null = null) {
    const dialog = new Dialog({ onClose });
    dialog.show(
        <div className="thm-ele-dialog thm-bg2" >
            <div>{message}</div>
            <footer className="thm-bg1" >
                <Button
                    icon="close"
                    label={_('close')}
                    flat={true}
                    onClick={dialog.hide} />
            </footer>
        </div>);
}
