export interface IBasicEvent {
    x: number;
    y: number;
    index: number;
    buttons: number;
    pointer: "mouse" | "touch" | "pen";
    clear: ()=>void;
}
