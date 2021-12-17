import type { Piece } from '$lib/game/Piece';

export class Cell {
    constructor(i: number, pos: [number, number]) {
        this.id = i;
        this.piece = null;
        this.targeted = false;
        this.touched = false;
        this.position = pos;
        this.supportedby = [];
        this.attackedby = [];
        this.marks = {};
    }

    id: number;
    piece: null | Piece;
    targeted: boolean;
    touched: boolean;
    position: [number, number];
    supportedby: number[];
    attackedby: number[];
    marks: Record<string, unknown>;
}
