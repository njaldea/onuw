import type { Piece } from './Piece';

export class Cell {
    constructor(i: number, pos: [number, number]) {
        this.id = i;
        this.piece = null;
        this.targeted = false;
        this.touched = false;
        this.position = pos;
        this.coveredby = [];
    }

    id: number;
    piece: null | Piece;
    targeted: boolean;
    touched: boolean;
    position: [number, number];
    coveredby: number[];
}
