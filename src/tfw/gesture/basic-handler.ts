import Finger from "./finger"

interface ITouch {
    identifier: number;
    clientX: number;
    clientY: number;
}

interface ITouchEvent {
    changedTouches: ITouch[];
}
type TTouchEventHandler = (evt:ITouchEvent) => void;

interface IMouseEvent {
    clientX: number;
    clientY: number;
    buttons: number;
}
type TMouseEventHandler = (evt:IMouseEvent) => void;

type TDeviceEventHandler = TTouchEventHandler|TMouseEventHandler;

interface IBasicEvent {
    x: number;
    y: number;
    index: number;
    buttons: number;
    pointer: "mouse" | "touch" | "pen";
}

type TBasicHandler = (evt: IBasicEvent) => void | undefined;

type TBasicEventName = "mousedown";

interface IDeviceHandlers {
    touchstart?: TTouchEventHandler;
    touchend?: TTouchEventHandler;
    touchmove?: TTouchEventHandler;
    mousedown?: TMouseEventHandler;
    mouseup?: TMouseEventHandler;
    mousemove?: TMouseEventHandler;
}

export default class BasicHandler {
    readonly element: HTMLElement;
    pointerType: string = "";
    pointerTypeTime: number = 0;
    deviceHandlers: IDeviceHandlers = {};
    fingers: Finger = new Finger();

    constructor(element: HTMLElement,
        handleDown: TBasicHandler,
        handleUp: TBasicHandler,
        handleMove: TBasicHandler) {
        this.element = element;
        attachDownEvent.call(this, handleDown);
        attachUpEvent.call( this, handleUp );
        attachMoveEvent.call( this, handleMove );
    }

    /**
     * If you device can hold mouse and touch events, you will receive two events.
     * This function prevent it.
     *
     * @param   {string} pointerType
     * @returns {boolean} If `false`, we must ignore this event.
     */
    checkPointerType(pointerType: string) {
        const now = Date.now();
        const delay = now - this.pointerTypeTime;
        this.pointerTypeTime = now;
        if (this.pointerType.length === 0 || delay > 500) {
            // If the user wat more than 500ms, he can change of pointer.
            this.pointerType = pointerType;
            return true;
        }
        return this.pointerType === pointerType;
    }

    detachEvents() {
        const element = this.element;
        const handlers = this.deviceHandlers;
        const eventNames = Object.keys(handlers);
        for (const eventName of eventNames) {
            const handler: TDeviceEventHandler|undefined = handlers[eventName as TBasicEventName];
            element.removeEventListener(eventName, handler, false);
        }
    }
}


function attachDownEvent(this: BasicHandler, handleDown: TBasicHandler) {
    attachDownEventTouch.call(this, handleDown);
    attachDownEventMouse.call(this, handleDown);
}


function attachDownEventTouch(this: BasicHandler, handleDown: TBasicHandler) {
    const { element, deviceHandlers } = this;
    const handler = (evt: ITouchEvent) => {
        if (!this.checkPointerType("touch")) return;
        for (const touch of evt.changedTouches) {
            handleDown({
                x: touch.clientX,
                y: touch.clientY,
                index: this.fingers.getIndex(touch.identifier),
                buttons: 1,
                pointer: "touch"
            });
        }
    };
    deviceHandlers.touchstart = handler;
    element.addEventListener("touchstart", handler, false);
}


function attachDownEventMouse(this: BasicHandler, handleDown: TBasicHandler) {
    const { element, deviceHandlers } = this;
    const handler = (evt: IMouseEvent) => {
        if (!this.checkPointerType("mouse")) return;
        handleDown({
            x: evt.clientX,
            y: evt.clientY,
            index: 0,
            buttons: evt.buttons,
            pointer: "mouse"
        });
    };
    deviceHandlers.mousedown = handler;
    element.addEventListener("mousedown", handler, false);
}


function attachUpEvent(this: BasicHandler, handleUp: TBasicHandler) {
    attachUpEventTouch.call(this, handleUp);
    attachUpEventMouse.call(this, handleUp);
}


function attachUpEventTouch(this: BasicHandler, handleUp: TBasicHandler) {
    const { element, deviceHandlers } = this;
    const handler = (evt: ITouchEvent) => {
        if (!this.checkPointerType("touch")) return;
        for (const touch of evt.changedTouches) {
            handleUp({
                x: touch.clientX,
                y: touch.clientY,
                index: this.fingers.getIndex(touch.identifier),
                buttons: 1,
                pointer: "touch"
            });
            this.fingers.remove(touch.identifier)
        }
    };
    deviceHandlers.touchend = handler;
    element.addEventListener("touchend", handler, false);
}


function attachUpEventMouse(this: BasicHandler, handleUp: TBasicHandler) {
    const { element, deviceHandlers } = this;
    const handler = (evt: IMouseEvent) => {
        if (!this.checkPointerType("mouse")) return;
        handleUp({
            x: evt.clientX,
            y: evt.clientY,
            index: 0,
            buttons: evt.buttons,
            pointer: "mouse"
        });
    };
    deviceHandlers.mouseup = handler;
    element.addEventListener("mouseup", handler, false);
}




function attachMoveEvent(this: BasicHandler, handleMove: TBasicHandler) {
    attachMoveEventTouch.call(this, handleMove);
    attachMoveEventMouse.call(this, handleMove);
}


function attachMoveEventTouch(this: BasicHandler, handleMove: TBasicHandler) {
    const { element, deviceHandlers } = this;
    const handler = (evt: ITouchEvent) => {
        if (!this.checkPointerType("touch")) return;
        for (const touch of evt.changedTouches) {
            handleMove({
                x: touch.clientX,
                y: touch.clientY,
                index: this.fingers.getIndex(touch.identifier),
                buttons: 1,
                pointer: "touch"
            });
            this.fingers.remove(touch.identifier)
        }
    };
    deviceHandlers.touchmove = handler;
    element.addEventListener("touchmove", handler, false);
}


function attachMoveEventMouse(this: BasicHandler, handleMove: TBasicHandler) {
    const { element, deviceHandlers } = this;
    const handler = (evt: IMouseEvent) => {
        if (!this.checkPointerType("mouse")) return;
        handleMove({
            x: evt.clientX,
            y: evt.clientY,
            index: 0,
            buttons: evt.buttons,
            pointer: "mouse"
        });
    };
    deviceHandlers.mousemove = handler;
    element.addEventListener("mousemove", handler, false);
}
