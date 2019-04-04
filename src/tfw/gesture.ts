const SYMBOL = Symbol("gesture");

type THandlers = {
    tap?: (event: IEvent)=>void;
    down?: (event: IEvent)=>void;
    up?: (event: IEvent)=>void;
};

interface IEvent {
    preventDefault: () => void;
    stopPropagation: () => void;
    target: HTMLElement;
    x?: number;
    y?: number;
}

interface IInternalEvent {
    x: number;
    y: number;
    event: PointerEvent;
}

class Gesture {
    _handlers: THandlers;
    _elem: HTMLElement;
    _pointer = { isDown: false, x0:0, y0:0, x:0, y:0, time:0 };

    constructor(private elem: HTMLElement) {
        elem[SYMBOL] = this;
        this._elem = elem;
        this._handlers = {};
        this._attachEvents();
    }

    on(handlers: THandlers) {
        this._handlers = Object.assign(this._handlers, handlers);
    }

    _onDown(event: IInternalEvent) {
        const elem = this._elem;
        const ptr = this._pointer;
        ptr.isDown = true;
        ptr.rect = elem.getBoundingClientRect();
        const x = event.x - ptr.rect.left;
        const y = event.y - ptr.rect.top;
        ptr.x0 = x;
        ptr.y0 = y;
        ptr.time = Date.now();
        console.log(ptr);

        const handlerDown = this._handlers.down;
        if( typeof handlerDown === 'function') {
            event.preventDefault();
            event.stopPropagation();
            handlerDown({
                target: elem,
                preventDefault: event.event.preventDefault.bind(event.event),
                stopPropagation: event.event.stopPropagation.bind(event.event),
                x, y
            })
        }

        const handlerTap = this._handlers.tap;
        if( typeof handlerTap === 'function') {
            event.event.preventDefault();
            event.event.stopPropagation();
        }
    }

    _onUp(event: IInternalEvent) {
        const elem = this._elem;
        const ptr = this._pointer;
        ptr.isDown = false;
        const x = event.x - ptr.rect.left;
        const y = event.y - ptr.rect.top;
        ptr.x = x;
        ptr.y = y;
        const time = Date.now() - ptr.time;
        console.log(ptr);

        const handlerUp = this._handlers.up;
        if( typeof handlerUp === 'function') {
            handlerUp({
                target: elem,
                preventDefault: event.event.preventDefault.bind(event.event),
                stopPropagation: event.event.stopPropagation.bind(event.event),
                x, y
            })
        }

        const handlerTap = this._handlers.tap;
        if( typeof handlerTap === 'function') {
            // Ensure there is less than 300 milliseconds between down and up events.
            if( time < 300 ) {
                const dist = (x - ptr.x0)*(x - ptr.x0) + (y - ptr.y0)*(y - ptr.y0);
                // Ensure we don't have moves too much.
                if( dist < 128) {
                    event.event.preventDefault();
                    event.event.stopPropagation();
                    handlerTap({
                        target: elem,
                        preventDefault: event.event.preventDefault.bind(event.event),
                        stopPropagation: event.event.stopPropagation.bind(event.event),
                        x, y
                    })
                }
            }
        }

    }

    _onPan(event: IInternalEvent) {}
    _onMove(event: IInternalEvent) {}

    _attachEvents() {
        const elem = this._elem;
        elem.addEventListener("pointerdown", (evt) => {
            console.log(evt);
            this._onDown({
                x: evt.clientX,
                y: evt.clientY,
                event: evt
            });
        }, false);
        elem.addEventListener("pointerup", (evt) => {
            this._onUp({
                x: evt.clientX,
                y: evt.clientY,
                event: evt
            });
        }, false);
    }
}

class GestureTouch extends Gesture {
    constructor(elem: HTMLElement) { super(elem); }
}

export default function(elem : HTMLElement): Gesture {
    if( !elem[SYMBOL]) {
        elem[SYMBOL] =window.PointerEvent ? new Gesture(elem) : new GestureTouch(elem);
    }
    return elem[SYMBOL];
}
