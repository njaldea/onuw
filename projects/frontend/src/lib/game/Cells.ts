import { Cell } from '$lib/game/Cell';

export class Cells {
    private cells: Cell[];
    private rcount: number;
    private ccount: number;

    public constructor(rcount: number, ccount: number) {
        this.reset(rcount, ccount);
    }

    public includes(cell: Cell): boolean {
        return this.cells.includes(cell);
    }

    public reset(rcount: number, ccount: number): void {
        this.cells = [];
        this.rcount = rcount;
        this.ccount = ccount;
        for (let r = 0; r < rcount; ++r) {
            for (let c = 0; c < ccount; ++c) {
                this.cells.push(new Cell(r * ccount + c, [r, c]));
            }
        }
    }

    public getCellByID(id: number): null | Cell {
        if (0 <= id && id < this.cells.length) {
            return this.cells[id];
        }
        return null;
    }

    public getCell(r: number, f: number): null | Cell {
        if (this.isValidTile(r, f)) {
            return this.cells[r * this.ccount + f];
        }
        return null;
    }

    public isValidTile(r: number, f: number): boolean {
        return 0 <= r && r < this.rcount && 0 <= f && f < this.ccount;
    }

    public *iter(reversed = false): Generator<Cell> {
        const [start, end, delta] = reversed
            ? [this.cells.length - 1, -1, -1]
            : [0, this.cells.length, 1];
        for (let i = start; i != end; i += delta) {
            yield this.cells[i];
        }
    }

    public resetCellStates(): void {
        const cells = [...this.iter()];
        cells.forEach((cell) => {
            cell.supportedby = [];
            cell.attackedby = [];
        });

        const populate = (
            cell: Cell,
            moves: (r: number, f: number) => Generator<[number, number]>,
            set: (c: Cell) => void
        ) => {
            if (cell.piece != null) {
                for (const [rank, file] of moves(...cell.position)) {
                    set(this.getCell(rank, file));
                }
            }
        };
        cells.forEach((cell) =>
            populate(
                cell,
                (r, f) => cell.piece.getSupportingMoves(r, f),
                (c) => c && c.supportedby.push(cell.id)
            )
        );
        cells.forEach((cell) =>
            populate(
                cell,
                (r, f) => cell.piece.getAttackingMoves(r, f),
                (c) => c && c.attackedby.push(cell.id)
            )
        );
    }
}
