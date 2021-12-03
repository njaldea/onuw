import type { Detail, Move } from '$lib/chess/game/Detail';
import { GroupMove } from '$lib/chess/game/Detail';
import { Piece } from '$lib/chess/Piece';

type MoveTransformer = (r: number, f: number, rdelta: number, fdelta: number) => [number, number];

export default class Pawn extends Piece {
    transform: MoveTransformer;

    constructor(team: boolean, detail: Detail, moveTransformer: MoveTransformer) {
        super('P', team, detail);
        this.transform = moveTransformer;
    }

    *getAttackingMoves(r: number, f: number): Generator<[number, number]> {
        const [nextr, nextf] = this.transform(r, f, 1, 0);
        if (this.detail.cell_inbound(nextr, nextf)) {
            if (this.detail.piece(nextr, nextf) == null) {
                yield [nextr, nextf];
            }
        }

        const predicate = (_r: number, _f: number) => {
            const piece = this.detail.piece(_r, _f);
            if (piece && piece.team !== this.team) {
                return true;
            }
            const enpassant = this.detail.cell_marks(r, f)?.enpassant ?? null;
            if (enpassant && enpassant[0] === _r && enpassant[1] === _f) {
                return true;
            }
            return false;
        };
        yield* this.diagonalMove(...this.transform(r, f, 1, 1), predicate);
        yield* this.diagonalMove(...this.transform(r, f, 1, -1), predicate);

        if (!this.detail.cell_touched(r, f)) {
            const forward1 = this.transform(r, f, 1, 0);
            if (this.detail.cell_inbound(...forward1) && this.detail.piece(...forward1) == null) {
                const forward2 = this.transform(r, f, 2, 0);
                if (
                    this.detail.cell_inbound(...forward2) &&
                    this.detail.piece(...forward2) == null
                ) {
                    yield forward2;
                }
            }
        }
    }

    *getSupportingMoves(r: number, f: number): Generator<[number, number]> {
        const predicate = (_r: number, _f: number) => {
            const piece = this.detail.piece(_r, _f);
            if (piece && piece.team === this.team) {
                return true;
            }
            const enpassant = this.detail.cell_marks(r, f)?.enpassant ?? null;
            if (enpassant && enpassant[0] === _r && enpassant[1] === _f) {
                return true;
            }
            return false;
        };
        yield* this.diagonalMove(...this.transform(r, f, 1, 1), predicate);
        yield* this.diagonalMove(...this.transform(r, f, 1, -1), predicate);
    }

    *diagonalMove(
        r: number,
        f: number,
        predicate: (_r: number, _f: number) => boolean
    ): Generator<[number, number]> {
        if (this.detail.cell_inbound(r, f)) {
            if (predicate(r, f)) {
                yield [r, f];
            }
        }
    }

    moveAdvance(from: [number, number], to: [number, number]): Move {
        const moves = new GroupMove();
        moves.add(this.detail.move_take(from, to));

        for (const fdelta of [+1, -1]) {
            const pos = this.transform(to[0], to[1], 0, fdelta);
            const piece = this.detail.piece(...pos);
            if (piece && piece.team !== this.team && piece.role === this.role) {
                const mark = {
                    ...this.detail.cell_marks(...pos),
                    enpassant: this.transform(...to, -1, 0)
                };
                moves.add(this.detail.move_mark(pos, mark, true));
            }
        }

        return moves;
    }

    moveCapture(from: [number, number], to: [number, number]): Move {
        const moves = new GroupMove();
        moves.add(this.detail.move_take(from, to));

        const enpassant = this.detail.cell_marks(...from)?.enpassant ?? null;
        if (enpassant != null && enpassant[0] === to[0] && enpassant[1] === to[1]) {
            moves.add(this.detail.move_remove([from[0], to[1]]));
        }

        return moves;
    }

    move(from: [number, number], to: [number, number]): Move {
        if (from[1] === to[1]) {
            if (Math.abs(from[0] - to[0]) === 2) {
                return this.moveAdvance(from, to);
            }
        } else {
            return this.moveCapture(from, to);
        }
        return this.detail.move_take(from, to);
    }
}
