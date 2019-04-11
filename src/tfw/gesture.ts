/**
 * Here is the list of all parameters used if all the handlers.
 *
 * tap({ x: number, y: number })
 */

import Hammer from "./gesture/hammer"
import Moves from "./gesture/moves"

const SYMBOL = Symbol("gesture");

let ID = 0;

type TGestureName = "tap" | "down" | "up" | "pandown" | "swipedown";
type TEventName = "keydown" | "keyup";
type THandlers = {
    [key: TGestureName | TEventName]: (event: IEvent) => void;
};

type THammerEventName = "tap" | "press" | "pressup";
type THammerHandlers = {
    [key: THammerEventName]: () => void;
}

interface IHammerEvent {
    angle: number;
    center: {
        x: number;
        y: number;
    };
    pointerType: string;
}

interface IEvent {
    preventDefault: () => void;
    stopPropagation: () => void;
    target: HTMLElement;
    x?: number;
    y?: number;
}

interface IInternalEvent {
    x?: number;
    y?: number;
    event: PointerEvent;
}

interface IPointer {
    isDown: boolean;
    moves: Moves;
    rect: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    type: "mouse" | "pen" | "touch" | null;
    id: number;
}

const STANDARD_EVENTS = ["keydown", "keyup"];

class GestureWithHammer {
    _handlers: THandlers = {};
    _elem: HTMLElement;
    _hammer: Hammer;
    _pointer: IPointer = {
        isDown: false,
        moves: new Moves(0, 0),
        rect: { left: 0, top: 0, width: 0, height: 0 },
        type: null,
        id: ID++
    };

    constructor(elem: HTMLElement) {
        this._elem = elem;
        this._hammer = new Hammer(elem);
        this._handleTap = this._handleTap.bind(this);
        this._attachLowLevelEvents();
    }

    /**
     * Check if a gesture has an handler attached.
     *
     * @param   {TGestureName[]}  gestureNames - Name of the gesture.
     * @returns {boolean} true if the gesture is mapped to a handler.
     */
    hasHandlerFor(...gestureNames: TGestureName[]): boolean {
        for (const gestureName of gestureNames) {
            if (typeof this._handlers[gestureName] === 'function') return true;
        }
        return false;
    }

    on(handlers: THandlers) {
        const elem = this._elem;
        const hammerHandlers: IHammerHandlers = {};
        this._handlers = Object.assign(this._handlers, handlers);
        Object.keys(handlers).forEach(eventName => {
            if (eventName !== eventName.trim().toLowerCase()) {
                throw Error(`Gesture names must be lowercase: you provided "${eventName}"!`);
            }
            if (STANDARD_EVENTS.indexOf(eventName) !== -1) {
                if (typeof this._handlers[eventName] === 'function') {
                    elem.removeEventListener(eventName, this._handlers[eventName], false);
                }
                elem.addEventListener(eventName, handlers[eventName], false);
            } else {
                const handler = handlers[eventName];
                switch (eventName) {
                    case "down":
                        hammerHandlers.press = wrap(handler, "down");
                        break;
                    case "up":
                        hammerHandlers.pressup = wrap(handler, "up");
                        break;
                    case "tap":
                        hammerHandlers.tap = wrap(handler, "tap");
                        break;
                    case "pandown":
                        break;
                    default:
                        throw Error(`Unknown gesture name: ${eventName}!`);
                }
            }
        });

        Object.keys(hammerHandlers).forEach(gestureName => {
            const handler = hammerHandlers[gestureName];
            this._hammer.on(gestureName, handler);
        })
    }

    //#####################################################################

    _attachLowLevelEvents() {

    }

    _handleTap(event: IHammerEvent) {

    }
}

function wrap(handler, name) {
    return function(...args) {
        console.log(`${name} {`, args);
        handler(...args);
        console.log(`} ${name}`);
    }
}





class Gesture {
    _handlers: THandlers;
    _elem: HTMLElement;
    _pointer: IPointer = {
        isDown: false,
        moves: new Moves(0, 0),
        rect: { left: 0, top: 0, width: 0, height: 0 },
        type: null,
        id: ID++
    };

    constructor(private elem: HTMLElement) {
        elem[SYMBOL] = this;
        this._elem = elem;
        this._handlers = {};
        this._attachEvents();
    }

    on(handlers: THandlers) {
        this._handlers = Object.assign(this._handlers, handlers);
        Object.keys(this._handlers).forEach(eventName => {
            if (STANDARD_EVENTS.indexOf(eventName) === -1) return;
            this._elem.addEventListener(eventName, this._handlers[eventName], false);
        });
    }

    /**
     * Check if a gesture has an handler attached.
     *
     * @param   {TGestureName[]}  gestureNames - Name of the gesture.
     * @returns {boolean} true if the gesture is mapped to a handler.
     */
    hasHandlerFor(...gestureNames: TGestureName[]): boolean {
        for (const gestureName of gestureNames) {
            if (typeof this._handlers[gestureName] === 'function') return true;
        }
        return false;
    }

    _onDown(event: IInternalEvent) {
        const elem = this._elem;
        const ptr = this._pointer;
        ptr.isDown = true;
        ptr.rect = elem.getBoundingClientRect();
        const x = event.x - ptr.rect.left;
        const y = event.y - ptr.rect.top;
        ptr.moves.init(x, y);

        if (this.hasHandlerFor("down")) {
            this._handlers.down({
                target: elem,
                preventDefault: event.event.preventDefault.bind(event.event),
                stopPropagation: event.event.stopPropagation.bind(event.event),
                x, y
            })
        }
    }

    _onUp(event: IInternalEvent) {
        const elem = this._elem;
        const ptr = this._pointer;
        const moves = ptr.moves;
        ptr.isDown = false;
        if (typeof event.x === 'undefined') event.x = moves.x;
        if (typeof event.y === 'undefined') event.y = moves.y;
        const x = event.x - ptr.rect.left;
        const y = event.y - ptr.rect.top;
        moves.add(x, y);

        if (this.hasHandlerFor("up")) {
            this._handlers.up({
                target: elem,
                preventDefault: event.event.preventDefault.bind(event.event),
                stopPropagation: event.event.stopPropagation.bind(event.event),
                x, y
            })
        }

        if (this.hasHandlerFor("tap")) {
            // Ensure there is less than 300 milliseconds between down and up events.
            if (moves.elapsedTime < 300) {
                const dx = moves.startX - moves.x;
                const dy = moves.startY - moves.y;
                const dist = dx * dx + dy * dy;
                // Ensure we don't have moves too much.
                if (dist < 12 * 12) {
                    event.event.preventDefault();
                    event.event.stopPropagation();
                    this._handlers.tap({
                        target: elem,
                        preventDefault: event.event.preventDefault.bind(event.event),
                        stopPropagation: event.event.stopPropagation.bind(event.event),
                        x, y
                    })
                }
            }
        }

    }

    _onGrab(event: IInternalEvent) {
        const ptr = this._pointer;
        const x = event.x - ptr.rect.left;
        const y = event.y - ptr.rect.top;
        ptr.moves.add(x, y);

        this._handlePanDown(event);
    }

    _handlePanDown(event: IInternalEvent) {
        if (!this.hasHandlerFor("pandown")) return;

        const moves = this._pointer.moves;
        const sx = Math.abs(moves.speedX);
        const sy = moves.speedY;
        if (sy < sx) return;

        const dx = Math.abs(moves.x - moves.startX);
        const dy = moves.y - moves.startY;
        if (dy < dx) return;

        this._handlers.pandown({
            target: this._elem,
            preventDefault: event.event.preventDefault.bind(event.event),
            stopPropagation: event.event.stopPropagation.bind(event.event),
            x: moves.x,
            y: moves.y
        })
    }

    _onMove(event: IInternalEvent) {
        //console.log("_onMove()", event);
    }

    _checkPointerType(evt: React.PointerEvent) {
        if (!this._pointer.type) {
            this._pointer.type = evt.pointerType;
            return true;
        }
        if (this._pointer.type !== evt.pointerType) {
            evt.preventDefault();
            evt.stopPropagation();
            return false;
        }
        return true;
    }

    _attachEvents() {
        const elem = this._elem;
        elem.addEventListener("pointerdown", evt => {
            console.log("DOWN!", evt.pointerType, evt);
            if (!this._checkPointerType(evt)) return;
            this._onDown({
                x: evt.clientX,
                y: evt.clientY,
                event: evt
            });
        }, false);
        elem.addEventListener("pointerup", evt => {
            console.log("UP!", evt.pointerType);
            if (!this._checkPointerType(evt)) return;
            this._onUp({
                x: evt.clientX,
                y: evt.clientY,
                event: evt
            });
        }, false);
        elem.addEventListener("pointercancel", evt => {
            console.log("CANCEL!", evt.pointerType);
            if (!this._checkPointerType(evt)) return;
            this._onUp({ event: evt });
        }, false);
        elem.addEventListener("pointermove", evt => {
            if (!this._checkPointerType(evt)) return;
            if (this._pointer.isDown) {
                this._onGrab({
                    x: evt.clientX,
                    y: evt.clientY,
                    event: evt
                });
            } else {
                this._onMove({
                    x: evt.clientX,
                    y: evt.clientY,
                    event: evt
                });
            }
        }, false);
    }
}

class GestureTouch extends Gesture {
    constructor(elem: HTMLElement) {
        super(elem);
        console.info("GESTURE TOUCH!!!");
    }
}

export default function(elem: HTMLElement): Gesture {
    if (!elem[SYMBOL]) {
        elem[SYMBOL] = new GestureWithHammer(elem);
        /*
        elem[SYMBOL] = window.PointerEvent
            ? new Gesture(elem)
            : new GestureTouch(elem);
            */
    }
    return elem[SYMBOL];
}
