import type { Piece } from '../Piece';
import type { Move } from './Detail';
import type { Cells } from '../Cell';
import { Detail } from './Detail';

export class BasicGame extends Detail {
    cells: Cells;
    constructor(cells: Cells) {
        super();
        this.cells = cells;
    }

    cell_inbound(r: number, f: number): boolean {
        return this.cells.isValidTile(r, f);
    }

    cell_touched(r: number, f: number): boolean {
        return this.cells.getCell(r, f)?.touched ?? false;
    }

    cell_supporters(r: number, f: number): [number, number][] {
        return this.cells.getCell(r, f)?.coveredby ?? [];
    }

    piece(r: number, f: number): Piece {
        return this.cells.getCell(r, f)?.piece ?? null;
    }

    move(from: [number, number], to: [number, number]): Move {
        const fromCell = this.cells.getCell(...from);
        const toCell = this.cells.getCell(...to);

        const prevstate = {
            to: toCell,
            from: fromCell,
            topiece: toCell.piece,
            frompiece: fromCell.piece,
            totouched: toCell.touched,
            fromtouched: fromCell.touched
        };

        const nextstate = {
            to: toCell,
            from: fromCell,
            topiece: fromCell.piece,
            frompiece: null,
            totouched: true,
            fromtouched: true
        };

        return {
            revert: () => {
                prevstate.to.piece = prevstate.topiece;
                prevstate.to.touched = prevstate.totouched;
                prevstate.from.piece = prevstate.frompiece;
                prevstate.from.touched = prevstate.fromtouched;
                return true;
            },
            execute: () => {
                nextstate.to.piece = nextstate.topiece;
                nextstate.to.touched = nextstate.totouched;
                nextstate.from.piece = nextstate.frompiece;
                nextstate.from.touched = nextstate.fromtouched;
                return true;
            }
        };
    }
}
