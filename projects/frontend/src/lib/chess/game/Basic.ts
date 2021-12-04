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

    cell_marks(r: number, f: number): Record<string, unknown> {
        return { ...(this.cells.getCell(r, f)?.marks ?? {}) };
    }

    cell_inbound(r: number, f: number): boolean {
        return this.cells.isValidTile(r, f);
    }

    cell_touched(r: number, f: number): boolean {
        return this.cells.getCell(r, f)?.touched ?? false;
    }

    cell_supporters(r: number, f: number): [number, number][] {
        const cell = this.cells.getCell(r, f);
        if (cell) {
            const idtopos = (_id): [number, number] => [
                Math.floor(_id / this.cells.ccount),
                _id % this.cells.ccount
            ];
            return cell.supportedby.map(idtopos);
        }
        return [];
    }

    piece(r: number, f: number): Piece {
        return this.cells.getCell(r, f)?.piece ?? null;
    }

    move_remove(position: [number, number]): Move {
        const cell = this.cells.getCell(...position);

        const prevstate = {
            cell: cell,
            piece: cell.piece,
            touched: cell.touched
        };

        const nextstate = {
            cell: cell,
            piece: null,
            touched: true
        };

        return {
            revert: () => {
                prevstate.cell.piece = prevstate.piece;
                prevstate.cell.touched = prevstate.touched;
                return true;
            },
            execute: () => {
                nextstate.cell.piece = nextstate.piece;
                nextstate.cell.touched = nextstate.touched;
                return true;
            },
            prenext: () => undefined,
            revertprenext: () => undefined
        };
    }

    move_take(from: [number, number], to: [number, number]): Move {
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
            },
            prenext: () => undefined,
            revertprenext: () => undefined
        };
    }

    move_mark(
        position: [number, number],
        marks: Record<string, unknown>,
        autorevert: boolean
    ): Move {
        const cell = this.cells.getCell(...position);
        const currentmarks = { ...cell.marks };
        const nextmarks = { ...marks };

        return {
            revert: () => {
                cell.marks = currentmarks;
                return true;
            },
            execute: () => {
                cell.marks = nextmarks;
                return true;
            },
            prenext: () => {
                if (autorevert) {
                    cell.marks = currentmarks;
                }
            },
            revertprenext: () => {
                if (autorevert) {
                    cell.marks = nextmarks;
                }
            }
        };
    }
}
