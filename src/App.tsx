import React from "react"
import Theme from "./tfw/theme"
import Stack from "./tfw/layout/stack"
import Button from "./tfw/view/button"
import PageButton from "./page/button"
import PageCheckbox from "./page/checkbox"

import "./tfw/font/josefin.css"
import "./App.css";

interface IAppState {
    page: string;
}

export default class App extends React.Component<{}, IAppState> {
    constructor(props: {}) {
        super(props);
        this.state = { page: "button" }
    }

    link(id: string) {
        return (
            <Button key={id} label={id}
                enabled={id !== this.state.page}
                onClick={() => this.setState({ page: id })} />
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
                <Stack value={this.state.page}>
                    <PageButton key="button" />
                    <PageCheckbox key="checkbox" />
                </Stack>
            </div>
        )
    }
}


//Theme.register("default", { bgP: "#1e90ff", bgS: "#ff8d1e", bg3: "#fff" });
Theme.register("dark", { bgP: "#1565b3", bgS: "#b36315", bg0: "#000", white: "#ccc" });
Theme.apply("default");
