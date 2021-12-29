import type { Piece } from '$lib/game/Piece';

export class Cell {
    public constructor(i: number, pos: [number, number]) {
        this.id = i;
        this.piece = null;
        this.targeted = false;
        this.touched = false;
        this.position = pos;
        this.supportedby = [];
        this.attackedby = [];
        this.marks = {};
    }

    public id: number;
    public piece: null | Piece;
    public targeted: boolean;
    public touched: boolean;
    public position: [number, number];
    public supportedby: number[];
    public attackedby: number[];
    public marks: Record<string, unknown>;
}
