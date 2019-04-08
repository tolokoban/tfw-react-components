import * as React from "react"
import Icon from "../tfw/view/icon"
import Flex from "../tfw/layout/flex"
import List from "../tfw/view/list"
import Button from "../tfw/view/button"
import Fieldset from "../tfw/view/Fieldset"

import Word from "./list/word"

import wordsList from "../data/words-list.json"

console.log("wordsList =", wordsList);

interface IListState {
    items: any[];
}

export default class PageButton extends React.Component<{}, IListState> {
    constructor(props: {}) {
        super(props);
        this.state = { items: wordsList.map(wordMapper) };
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

    render() {
        return (
            <div className="page">
                <Fieldset label="Combo">
                    <ul>
                        <li><code>items</code> (any[])</li>
                        <li><code>itemHeight</code> (unit)</li>
                    </ul>
                </Fieldset>
                <hr />
                <Flex alignItems="flex-start">
                    <List items={this.state.items}
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
