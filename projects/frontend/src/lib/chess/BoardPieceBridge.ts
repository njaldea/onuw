import type { Piece } from '$lib/game/Piece';
import type { Cells } from '$lib/game/Cells';
import { Move } from '$lib/game/IMove';
import { IBoardPieceBridge } from '$lib/game/IBoardPieceBridge';

export class BoardPieceBridge extends IBoardPieceBridge {
    private cells: Cells;
    public constructor(cells: Cells) {
        super();
        this.cells = cells;
    }

    override cell_marks(r: number, f: number): Record<string, unknown> {
        return { ...(this.cells.getCell(r, f)?.marks ?? {}) };
    }

    override cell_inbound(r: number, f: number): boolean {
        return this.cells.isValidTile(r, f);
    }

    override cell_touched(r: number, f: number): boolean {
        return this.cells.getCell(r, f)?.touched ?? false;
    }

    override *cell_supporters(r: number, f: number): Generator<[number, number]> {
        const cell = this.cells.getCell(r, f);
        if (cell) {
            for (const id of cell.supportedby) {
                const supportingcell = this.cells.getCellByID(id);
                if (supportingcell) {
                    yield supportingcell.position;
                }
            }
        }
    }

    override piece(r: number, f: number): Piece {
        return this.cells.getCell(r, f)?.piece ?? null;
    }

    override move_remove(position: [number, number]): Move {
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

        return new Move({
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
        });
    }

    override move_take(from: [number, number], to: [number, number]): Move {
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

        return new Move({
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
        });
    }

    override move_mark(
        position: [number, number],
        marks: Record<string, unknown>,
        autorevert: boolean
    ): Move {
        const cell = this.cells.getCell(...position);
        const currentmarks = { ...cell.marks };
        const nextmarks = { ...marks };

        return new Move({
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
        });
    }
}
