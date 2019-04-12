import React from "react"
import Theme from "./tfw/theme"
import Flex from "./tfw/layout/flex"
import Stack from "./tfw/layout/stack"
import Sidemenu from "./tfw/layout/sidemenu"
import Combo from "./tfw/view/combo"
import Button from "./tfw/view/button"
import PageList from "./page/list"
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
    showmenu: boolean;
}

export default class App extends React.Component<{}, IAppState> {
    constructor(props: {}) {
        super(props);
        this.handleThemeChange = this.handleThemeChange.bind(this);
        this.state = Storage.local.get("state", { page: "button", theme: "default", showmenu: true });
        Theme.apply(this.state.theme);
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
                classes={"thm-flex-grow-1"}
                enabled={id !== this.state.page}
                onClick={() => this.setState({ page: id })} />
        )
    }

    render() {
        return (
            <Sidemenu
                show={this.state.showmenu}
                onShowChanged={() => this.setState({ showmenu: !this.state.showmenu })}
                head="Tolokoban's components"
                menu={(
                    <div>
                        <Combo label="Current theme"
                            wide={true}
                            value={this.state.theme}
                            onChange={this.handleThemeChange}>
                            <div key="default">Default</div>
                            <div key="ebony">Ebony</div>
                            <div key="fruity">Fruity</div>
                            <div key="dark">Dark</div>
                        </Combo>
                        <hr />
                        <Flex >{[
                            this.link("button"),
                            this.link("checkbox"),
                            this.link("color-button-list"),
                            this.link("color-button"),
                            this.link("combo"),
                            this.link("icon"),
                            this.link("input"),
                            this.link("list"),
                            this.link("pane")
                        ]}</Flex>
                    </div>
                )}
                body={(
                    <div className="App">
                        <Stack value={this.state.page} scrollable={true}>
                            <PageCombo key="combo" />
                            <PageButton key="button" />
                            <PageCheckbox key="checkbox" />
                            <PageIcon key="icon" />
                            <PageList key="list" />
                        </Stack>
                    </div>
                )} />
        )
    }
}


Theme.register("default", { bgP: "#1e90ff", bgS: "#ff8d1e", bg3: "#fff" });
Theme.register("ebony", {
    white: "#fda", black: "#420",
    bg0: "#febb77", bg3: "#fee3c7",
    bgP: "#630", bgS: "#d36900"
});
Theme.register("fruity", { bgP: "#900", bgS: "#faa", bg3: "#daa", white: "#fed" });
Theme.register("dark", { bgP: "#059335", bg0: "#000", white: "#ccc" });
