import React from "react"
import Theme from "./tfw/theme"
import Stack from "./tfw/layout/stack"
import Combo from "./tfw/view/combo"
import Button from "./tfw/view/button"
import PageIcon from "./page/icon"
import PageCombo from "./page/combo"
import PageButton from "./page/button"
import PageCheckbox from "./page/checkbox"

import Storage from "./tfw/storage"

import "./tfw/font/josefin.css"
import "./App.css";

interface IAppState {
    page: string;
    theme: string;
}

export default class App extends React.Component<{}, IAppState> {
    constructor(props: {}) {
        super(props);
        this.handleThemeChange = this.handleThemeChange.bind(this);
        this.state = Storage.local.get("state", { page: "button", theme: "default" });
    }

    componentDidUpdate() {
        Storage.local.set("state", this.state);
    }

    handleThemeChange(name: string) {
        this.setState({ theme: name });
        Theme.apply(name);
    }

    link(id: string) {
        return (
            <Button key={id} label={id}
                enabled={id !== this.state.page}
                onClick={() => this.setState({ page: id })} />
        )
    }

    render() {
        return (
            <div className="App thm-bg0">
                <nav className="thm-ele-nav thm-bg2">
                    <Combo label="Current theme"
                        wide={true}
                        value={this.state.theme}
                        onChange={this.handleThemeChange}>
                        <div key="default">Default</div>
                        <div key="lemon">Lemon</div>
                        <div key="salmon">Salmon</div>
                        <div key="dark">Dark</div>
                    </Combo>
                    <hr />
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
                    <PageCombo key="combo" />
                    <PageButton key="button" />
                    <PageCheckbox key="checkbox" />
                    <PageIcon key="icon" />
                </Stack>
            </div>
        )
    }
}


Theme.register("default", { bgP: "#1e90ff", bgS: "#ff8d1e", bg3: "#fff" });
Theme.register("lemon", { bgP: "#790", bgS: "#dd1", bg3: "#eeffee", white: "#efe" });
Theme.register("salmon", { bgP: "#900", bgS: "#faa", bg3: "#daa", white: "#fed" });
Theme.register("dark", { bgP: "#059335", bg0: "#000", white: "#ccc" });
Theme.apply("default");
