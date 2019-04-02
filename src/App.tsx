import React from "react"
import Theme from "./tfw/theme"
import Button from "./tfw/view/button"
import PageButton from "./page/button"

import "./tfw/font/josefin.css"
import "./App.css";

interface IAppState {
    currPage: string;
    prevPage: string;
}

export default class App extends React.Component<{}, IAppState> {
    constructor(props: {}) {
        super(props);
        this.state = { currPage: "", prevPage: "" }
    }

    link(id: string) {
        return (
            <Button key={id} label={id} />
        )
    }

    render() {
        const s = this.state;
        return (
            <div className="App thm-bg0">
                <nav className="thm-ele-nav thm-bg2">
                    <div>{[
                        this.link("button"),
                        this.link("checkbox"),
                        this.link("color-button-list"),
                        this.link("color-button"),
                        this.link("combo"),
                        this.link("icon"),
                        this.link("input"),
                        this.link("pane")
                    ]}</div>
                </nav>
                <div>
                    <PageButton key="button" />
                </div>
            </div>
        )
    }
}

Theme.register("default", { bgP: "#1e90ff", bgS: "#ff8d1e" });
Theme.apply("default");
