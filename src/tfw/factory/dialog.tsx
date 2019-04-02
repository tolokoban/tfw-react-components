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
import "./dialog.css"

import Button from "../view/button"

import Intl from "../intl";
const _ = Intl.make(require("./dialog.yaml"));

const gDialogs = [];

document.addEventListener("keydown", (event) => {
    if (gDialogs.length === 0) return;
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    const dialog = gDialogs[gDialogs.length - 1];
    dialog.hide();
}, true);

class Dialog {
    private screen: HTMLElement;

    constructor() {
        const screen = document.createElement("div");
        screen.className = "tfw-factory-dialog";
        document.body.appendChild(screen);
        this.screen = screen;
        this.hide = this.hide.bind(this);
        gDialogs.push(this);
    }

    show(body: React.Component) {
        ReactDOM.render(body, this.screen);
        setTimeout(() => this.screen.classList.add("show"), 10);
    }

    hide() {
        const screen = this.screen;
        screen.classList.remove("show");
        setTimeout(() => {
            document.body.removeChild(screen);
        }, 200);
        gDialogs.pop();
        if (typeof this.onClose === 'function') {
            this.onclose();
        }
    }
}

function alert(message: string, onClose: () => void = null) {
    const dialog = new Dialog();
    dialog.onClose = onClose;
    dialog.show(
        <div className="thm-ele-dialog thm-bg2" >
            <div>{message} </div>
            <footer className="thm-bg1" >
                <Button
                    icon="close"
                    label={_('close')}
                    flat={true}
                    onClick={dialog.hide} />
            </footer>
        </div>);
}
