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

interface IMinimalEvent {
    preventDefault: () => void;
    stopPropagation: () => void;
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
    type: string | null;
    time: number;
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
        time: 0,
        id: ID++
    };

    constructor(elem: HTMLElement) {
        this._elem = elem;
        this._hammer = new Hammer(elem);
        this._handleDown = this._handleDown.bind(this);
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
        const hammer = this._hammer;
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
                this._onGesture(eventName, handlers[eventName]);
            }
        });
    }

    //#####################################################################

    _onGesture(name: string, handler: () => void) {
        const hammer = this._hammer;
        switch (name) {
            case "down":
                break;
            case "up":
                break;
            case "press":
                hammer.on("press", handler);
                break;
            case "tap":
                hammer.on("tap", this._handleTap);
                break;
            case "pandown":
                break;
            default:
                throw Error(`Unknown gesture name: ${name}!`);
        }
    }
    /**
     * When several pointers are present, their events are triggered one
     * at the time. We must take care of the first one, but ignore the others.
     *
     * @param   {IMinimalEvent} evt - The event to look at.
     * @returns {boolean} `true` means we must take care of this event.
     * `false` means we must ignore it.
     */
    _checkPointerType(evt: IMinimalEvent) {
        const ptr = this._pointer;
        const now = Date.now();
        if (!ptr.type || now - ptr.time > 400) {
            // Just take the first pointer type we get and set it
            // has the next default one.
            ptr.type = evt.pointerType;
            ptr.time = now;
            return true;
        }
        if (ptr.type !== evt.pointerType) {
            evt.preventDefault();
            evt.stopPropagation();
            return false;
        }
        ptr.time = now;
        return true;
    }

    /**
     * We need to listen at low level events, such has pointer/touch start and end.
     */
    _attachLowLevelEvents() {
        if (window.PointerEvent) this._attachLowLevelPointerEvents();
        else this._attachLowLevelTouchEvents();
    }

    _attachLowLevelPointerEvents() {
        const elem = this._elem;
        elem.addEventListener("pointerdown", evt => {
            if (!this._checkPointerType(evt)) return;
            this._handleDown(
                evt.clientX,
                evt.clientY
            );
        }, false);

    }

    _attachLowLevelTouchEvents() {
        const elem = this._elem;
        elem.addEventListener("touchstart", evt => {
            console.info("[TOUCH] evt=", evt);
            if (!this._checkPointerType(evt)) return;
            /*
            this._handleDown(
                evt.clientX,
                evt.clientY
            );*/
        }, false);
    }

    _handleTap(event: IHammerEvent) {
        if (!this.hasHandlerFor("tap")) return;
        const handler = this._handlers.tap;
        const { x, y } = this._pointer.moves;
        console.info(`TAP[${this._pointer.id}]`, x, y, event.center, " ; ",
            event.center.x - x,
            event.center.y - y);
        handler({
            x: event.center.x - x,
            y: event.center.y - y,
            id: this._pointer.id
        });
    }

    _handleDown(clientX: number, clientY: number) {
        const ptr = this._pointer;
        const elem = this._elem;
        ptr.rect = elem.getBoundingClientRect();
        console.info("ptr.rect, clientX, clientY=", ptr.rect, clientX, clientY);
        ptr.moves.init(clientX - ptr.rect.left, clientY - ptr.rect.top);
        console.info("ptr.moves.x, ptr.moves.y=", ptr.moves.x, ptr.moves.y);
        if (this.hasHandlerFor("down")) {
            this._handlers.down({ x: ptr.moves.x, y: ptr.moves.y });
        }
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
        //elem[SYMBOL] = new GestureWithHammer(elem);
        elem[SYMBOL] = window.PointerEvent
            ? new Gesture(elem)
            : new GestureTouch(elem);
    }
    return elem[SYMBOL];
}
