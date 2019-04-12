/**
 * Here is the list of all parameters used if all the handlers.
 *
 * tap({ x: number, y: number })
 */

import Moves from "./gesture/moves"
import BasicHandler from "./gesture/basic-handler"
import { IBasicEvent } from "./gesture/basic-handler.types"

const SYMBOL = Symbol("gesture");

let ID = 0;

type TGestureName = "tap" | "down" | "up" | "pandown" | "swipedown";
type TEventName = "keydown" | "keyup";
type THandlers = {
    [key: TGestureName | TEventName]: (event: IEvent) => void;
};

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

class Gesture {
    private readonly basicHandler: BasicHandler;
    private handlers: THandlers;
    private element: HTMLElement;
    private readonly pointers: IPointer[];
    private readonly id: number;

    constructor(private elem: HTMLElement) {
        elem[SYMBOL] = this;
        this.id = ID++;
        this.element = elem;
        this.handlers = {};
        this.basicHandler = new BasicHandler(
            elem,
            this.handleDown.bind(this),
            this.handleUp.bind(this),
            this.handleMove.bind(this)
        )
        this.pointers = new Array(3);
    }

    get identifier() { return this.id; }

    on(handlers: THandlers) {
        this.handlers = Object.assign(this.handlers, handlers);
        Object.keys(this.handlers).forEach(eventName => {
            if (STANDARD_EVENTS.indexOf(eventName) === -1) return;
            // This is a non-pointer event. (i.e., keyboard, resize, ...)
            this.element.addEventListener(eventName, this.handlers[eventName], false);
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
            if (typeof this.handlers[gestureName] === 'function') return true;
        }
        return false;
    }

    private getPointer(index: number) {
        const pointers = this.pointers;
        if (typeof pointers[index] === 'undefined') {
            pointers[index] = {
                isDown: false,
                moves: new Moves(0, 0),
                rect: { left: 0, top: 0, width: 0, height: 0 }
            }
        }
        return pointers[index];
    }

    private handleDown(event: IBasicEvent) {
        // We want not deal with more than 3 simultaneous touches.
        if (event.index > 2) return;

        const { element } = this;
        const ptr = this.getPointer(event.index);
        ptr.isDown = true;
        ptr.rect = element.getBoundingClientRect();
        const x = event.x - ptr.rect.left;
        const y = event.y - ptr.rect.top;
        ptr.moves.init(x, y);

        if (this.hasHandlerFor("down")) {
            this.handlers.down(Object.assign(event, { x, y }));
        }
    }

    private handleUp(event: IBasicEvent) {
        // We want not deal with more than 3 simultaneous touches.
        if (event.index > 2) return;

        const ptr = this.getPointer(event.index);
        ptr.isDown = false;
        const x = event.x - ptr.rect.left;
        const y = event.y - ptr.rect.top;
        ptr.moves.add(x, y);

        if (this.hasHandlerFor("up")) {
            this.handlers.up(Object.assign(event, { x, y }));
        }
        this.recognizeTap(event, ptr);
    }

    private handleMove(event: IBasicEvent) {
        // We want not deal with more than 3 simultaneous touches.
        if (event.index > 2) return;

        const ptr = this.getPointer(event.index);
        const x = event.x - ptr.rect.left;
        const y = event.y - ptr.rect.top;
        ptr.moves.add(x, y);
        this.recognizePan(event, ptr);
    }

    private recognizeTap(evt: IBasicEvent, ptr: IPointer) {
        // A tap is recognized only if there is less than 400ms
        // between down and up, and if the pointer has not moves more
        // than 16px.
        if (!this.hasHandlerFor("tap") || ptr.moves.elapsedTime > 400) return;
        const moves = ptr.moves;
        const dx = Math.abs(moves.x - moves.startX);
        if (dx > 16) return;
        const dy = Math.abs(moves.y - moves.startY);
        if (dy > 16) return;

        evt.clear();
        this.handlers.tap(Object.assign(evt, { x: moves.x, y: moves.y }));
    }

    private recognizePan(evt: IBasicEvent, ptr: IPointer) {
        if (!ptr.isDown) return;
        this.recognizePanDown(evt, ptr);
    }

    private recognizePanDown(evt: IBasicEvent, ptr: IPointer) {
        if (!this.hasHandlerFor("pandown")) return;

        // Check that we are panning down.
        const moves = ptr.moves;
        const sx = Math.abs(moves.speedX);
        const sy = moves.speedY;
        if (sy < sx) return;
        // Chack that the final point is beneath the initial one.
        const dx = Math.abs(moves.x - moves.startX);
        const dy = moves.y - moves.startY;
        if (dy < dx) return;

        evt.clear();
        this.handlers.pandown(Object.assign(evt, { x: moves.x, y: moves.y }));
    }

    /*
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
    */
}

export default function(elem: HTMLElement): Gesture {
    if (!elem[SYMBOL]) {
        elem[SYMBOL] = new Gesture(elem);
    }
    return elem[SYMBOL];
}
