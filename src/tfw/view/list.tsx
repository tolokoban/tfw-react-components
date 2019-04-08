import * as React from "react"
import "./list.css"
import Debouncer from "../debouncer";
import castInteger from "../converter/integer"

interface IListProps {
    items: any[];
    mapper: (item: any) => React.ReactElement;
    itemHeight?: number;
}

interface IListState {
    items: any[];
}

export default class ItemList extends React.Component<IListProps, IListState> {
    private readonly refMain: React.RefObject<HTMLDivElement>;
    private readonly refHead: React.RefObject<HTMLDivElement>;
    private readonly refBody: React.RefObject<HTMLDivElement>;
    private readonly refTail: React.RefObject<HTMLDivElement>;
    private lastFirstItemIndex: number;
    private lastVisibleItemsCount: number;
    private lastItemsArray: any[];
    private itemHeight: number = 36;

    constructor(props: IListProps) {
        super(props);
        this.refMain = React.createRef();
        this.refHead = React.createRef();
        this.refBody = React.createRef();
        this.refTail = React.createRef();
        this.onScroll = Debouncer(this.onScroll.bind(this), 30);
        this.lastFirstItemIndex = -1;
        this.lastVisibleItemsCount = -1;
        this.lastItemsArray = [];
        this.state = { items: [] };
    }

    onScroll(evt: any = null): void {
        const main = this.refMain.current;
        const head = this.refHead.current;
        const body = this.refBody.current;
        const tail = this.refTail.current;
        if (!main || !head || !body || !tail) return;

        const top = Math.floor(main.scrollTop);
        const height = Math.floor(main.getBoundingClientRect().height);
        const itemsCount = this.props.items.length;
        const firstItemIndex = Math.min(
            itemsCount, Math.floor(top / this.itemHeight));
        const visibleItemsCount = Math.min(
            itemsCount - firstItemIndex,
            1 + Math.ceil(height / this.itemHeight)
        );
        const tailCount = this.props.items.length - firstItemIndex - visibleItemsCount;

        head.style.height = `${this.itemHeight * firstItemIndex}px`;
        body.style.height = `${this.itemHeight * visibleItemsCount}px`;
        tail.style.height = `${this.itemHeight * tailCount}px`;

        main.scrollTop = top;
        //console.log(top, `${firstItemIndex}+${visibleItemsCount}+${tailCount}=${firstItemIndex + visibleItemsCount + tailCount}`);
        //console.log(head.style.height, body.style.height, tail.style.height);

        if (this.lastFirstItemIndex !== firstItemIndex
            || this.lastVisibleItemsCount !== visibleItemsCount) {
            this.lastFirstItemIndex = firstItemIndex;
            this.lastVisibleItemsCount = visibleItemsCount;
            this.setState({
                items: this.props.items.slice(firstItemIndex, firstItemIndex + visibleItemsCount)
            });
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.onScroll, false);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onScroll, false);
    }

    render() {
        if (this.props.items.length < 1) return null;
        this.itemHeight = castInteger(this.props.itemHeight, 36);
        if (this.lastItemsArray !== this.props.items) {
            this.lastVisibleItemsCount = -1;
            this.lastItemsArray = this.props.items;
        }
        this.onScroll();

        if (typeof this.props.mapper !== 'function') {
            console.error("props =", this.props);
            throw Error(`<List mapper="..." ...> Attribute mapper must be a function which returns a ReactElement!`);
        }
        let children = null;
        try {
            children = this.state.items
                .map(this.props.mapper)
                .map(content => (
                    <div class="item"
                        style={{
                            height: `${this.itemHeight}px`,
                            minHeight: `${this.itemHeight}px`,
                            maxHeight: `${this.itemHeight}px`
                        }}>{content}</div >
                ));
        }
        catch (ex) {
            throw Error(`<List mapper="..." ...> Attribute mapper returns an exception:\n${ex}`);
        }
        return (
            <div className="tfw-view-list thm-bg2"
                onScroll={this.onScroll}
                ref={this.refMain}>
                <div className="space" ref={this.refHead} />
                <div className="body" ref={this.refBody}>{
                    children
                }</div>
                <div className="space" ref={this.refTail} />
            </div>
        );
    }
}
