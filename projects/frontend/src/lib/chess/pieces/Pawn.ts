import type { IBoardPieceBridge } from '$lib/game/IBoardPieceBridge';
import { GroupMove, IMove } from '$lib/game/IMove';
import { GamePiece } from '$lib/game/Piece';

type MoveTransformer = (r: number, f: number, rdelta: number, fdelta: number) => [number, number];

export default class Pawn extends GamePiece {
    _transform: MoveTransformer;

    constructor(team: boolean, bridge: IBoardPieceBridge, moveTransformer: MoveTransformer) {
        super('P', team, bridge);
        this._transform = moveTransformer;
    }

    *getAttackingMoves(r: number, f: number): Generator<[number, number]> {
        const [nextr, nextf] = this._transform(r, f, 1, 0);
        if (this.bridge.cell_inbound(nextr, nextf)) {
            if (this.bridge.piece(nextr, nextf) == null) {
                yield [nextr, nextf];
            }
        }

        const predicate = (_r: number, _f: number) => {
            const piece = this.bridge.piece(_r, _f);
            if (piece && piece.team !== this.team) {
                return true;
            }
            const enpassant = this.bridge.cell_marks(r, f)?.enpassant ?? null;
            if (enpassant && enpassant[0] === _r && enpassant[1] === _f) {
                return true;
            }
            return false;
        };
        yield* this.diagonalMove(...this._transform(r, f, 1, 1), predicate);
        yield* this.diagonalMove(...this._transform(r, f, 1, -1), predicate);

        if (!this.bridge.cell_touched(r, f)) {
            const forward1 = this._transform(r, f, 1, 0);
            if (this.bridge.cell_inbound(...forward1) && this.bridge.piece(...forward1) == null) {
                const forward2 = this._transform(r, f, 2, 0);
                if (
                    this.bridge.cell_inbound(...forward2) &&
                    this.bridge.piece(...forward2) == null
                ) {
                    yield forward2;
                }
            }
        }
    }

    *getSupportingMoves(r: number, f: number): Generator<[number, number]> {
        yield* this.diagonalMove(...this._transform(r, f, 1, 1));
        yield* this.diagonalMove(...this._transform(r, f, 1, -1));
    }

    *diagonalMove(
        r: number,
        f: number,
        predicate: (_r: number, _f: number) => boolean = null
    ): Generator<[number, number]> {
        if (this.bridge.cell_inbound(r, f)) {
            if (!predicate || predicate(r, f)) {
                yield [r, f];
            }
        }
    }

    moveAdvance(from: [number, number], to: [number, number]): IMove {
        const moves = new GroupMove();
        moves.add(this.bridge.move_take(from, to));

        for (const fdelta of [+1, -1]) {
            const pos = this._transform(to[0], to[1], 0, fdelta);
            const piece = this.bridge.piece(...pos);
            if (piece && piece.team !== this.team && piece.role === this.role) {
                const mark = {
                    ...this.bridge.cell_marks(...pos),
                    enpassant: this._transform(...to, -1, 0)
                };
                moves.add(this.bridge.move_mark(pos, mark, true));
            }
        }

        return moves;
    }

    moveCapture(from: [number, number], to: [number, number]): IMove {
        const moves = new GroupMove();
        moves.add(this.bridge.move_take(from, to));

        const enpassant = this.bridge.cell_marks(...from)?.enpassant ?? null;
        if (enpassant != null && enpassant[0] === to[0] && enpassant[1] === to[1]) {
            moves.add(this.bridge.move_remove([from[0], to[1]]));
        }

        return moves;
    }

    move(from: [number, number], to: [number, number]): IMove {
        if (from[1] === to[1]) {
            if (Math.abs(from[0] - to[0]) === 2) {
                return this.moveAdvance(from, to);
            }
        } else {
            return this.moveCapture(from, to);
        }
        return this.bridge.move_take(from, to);
    }
}
