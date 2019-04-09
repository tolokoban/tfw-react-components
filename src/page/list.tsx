import * as React from "react"
import Icon from "../tfw/view/icon"
import Flex from "../tfw/layout/flex"
import List from "../tfw/view/list"
import Button from "../tfw/view/button"
import Checkbox from "../tfw/view/checkbox"
import Fieldset from "../tfw/view/Fieldset"

import Word from "./list/word"

import wordsList from "../data/words-list.json"

console.log("wordsList =", wordsList);

interface IListState {
    items: any[];
    animateRefresh: boolean;
}

export default class PageButton extends React.Component<{}, IListState> {
    constructor(props: {}) {
        super(props);
        this.state = { items: wordsList.map(wordMapper), animateRefresh: false };
    }

    sortByName() {
        return this.state.items.slice().sort((a, b) => {
            const wa = a.name;
            const wb = b.name;
            if (wa < wb) return -1;
            if (wa > wb) return +1;
            return 0;
        })
    }

    sortByOccurences() {
        return this.state.items.slice().sort((a, b) => {
            const oa = a.occurences;
            const ob = b.occurences;
            if (oa < ob) return +1;
            if (oa > ob) return -1;
            return 0;
        })
    }

    render() {
        return (
            <div className="page">
                <Flex alignItems="flex-start">
                    <List items={this.state.items}
                        width="40vw"
                        height="90vh"
                        animateRefresh={this.state.animateRefresh}
                        itemHeight={48}
                        mapper={item => {
                            const { name, occurences, types } = item;
                            return <Word key={name} name={name} occurences={occurences} types={types} />
                        }} />
                    <div>
                        <Button label="Sort by word"
                            onClick={() => this.setState({
                                items: this.sortByName()
                            })} />
                        <Button label="Sort by occurences"
                            onClick={() => this.setState({
                                items: this.sortByOccurences()
                            })} />
                        <Checkbox label="Animate refresh"
                            value={this.state.animateRefresh}
                            onChange={animateRefresh => this.setState({ animateRefresh })} />
                        <hr />
                        <Fieldset label="List">
                            <ul>
                                <li><code>items</code> (array): Data for the list.</li>
                                <li><code>mapper</code> (function): Takes an item (element of items) and returns a React Element.</li>
                                <li><code>animateRefresh</code> (boolean): Show an animation you can use when you want to refresh the list (<i>default = false</i>).</li>
                            </ul>
                        </Fieldset>
                    </div>
                </Flex>
            </div>
        )
    }
}

export default interface IWord {
    name: string;
    occurences: number;
    types: string[];
}

function wordMapper(item: any): IWord {
    const [name, occurences, types] = item;
    return { name, occurences, types: types.split(",") };
}
