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
    coveredby: [number, number][];
}

export class Cells {
    cells: Cell[];
    rcount: number;
    ccount: number;

    constructor(rcount: number, ccount: number) {
        this.cells = [];
        this.rcount = rcount;
        this.ccount = ccount;
        for (let r = 0; r < rcount; ++r) {
            for (let c = 0; c < ccount; ++c) {
                this.cells.push(new Cell(r * ccount + c, [r, c]));
            }
        }
    }

    getCell(r: number, f: number) {
        if (this.isValidTile(r, f)) {
            return this.cells[r * this.ccount + f];
        }
        return null;
    }

    isValidTile(r: number, f: number) {
        return 0 <= r && r < this.rcount && 0 <= f && f < this.ccount;
    }

    *iter(reversed: boolean = false): Generator<Cell> {
        if (reversed) {
            for (const cell of this.cells.slice(0, this.cells.length).reverse()) {
                yield cell;
            }
        } else {
            for (const cell of this.cells) {
                yield cell;
            }
        }
    }
}
