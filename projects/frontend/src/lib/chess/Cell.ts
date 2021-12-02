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
        this.reset(rcount, ccount);
    }

    reset(rcount: number, ccount: number): void {
        this.cells = [];
        this.rcount = rcount;
        this.ccount = ccount;
        for (let r = 0; r < rcount; ++r) {
            for (let c = 0; c < ccount; ++c) {
                this.cells.push(new Cell(r * ccount + c, [r, c]));
            }
        }
    }

    getCell(r: number, f: number): null | Cell {
        if (this.isValidTile(r, f)) {
            return this.cells[r * this.ccount + f];
        }
        return null;
    }

    isValidTile(r: number, f: number): boolean {
        return 0 <= r && r < this.rcount && 0 <= f && f < this.ccount;
    }

    *iter(reversed = false): Generator<Cell> {
        const [start, end, delta] = reversed
            ? [this.cells.length - 1, -1, -1]
            : [0, this.cells.length, 1];
        for (let i = start; i != end; i += delta) {
            yield this.cells[i];
        }
    }

    resetCellSupport(): void {
        [...this.iter()].forEach((cell) => (cell.coveredby = []));
        [...this.iter()].forEach((cell) => {
            if (cell.piece != null) {
                for (const [rank, file] of cell.piece.getSupportingMoves(...cell.position)) {
                    const c = this.getCell(rank, file);
                    if (c) {
                        c.coveredby.push(cell.position);
                    }
                }
            }
        });
    }
}
