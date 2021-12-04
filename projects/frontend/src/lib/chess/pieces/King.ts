import type { Detail, Move } from '$lib/chess/game/Detail';
import { GroupMove } from '$lib/chess/game/Detail';
import { Piece } from '$lib/chess/Piece';

export default class King extends Piece {
    constructor(team: boolean, detail: Detail) {
        super('K', team, detail);
    }

    *getAttackingMoves(r: number, f: number): Generator<[number, number]> {
        for (const m of this.movesCollect(r, f)) {
            if (!this.detail.cell_inbound(...m)) {
                continue;
            }
            const piece = this.detail.piece(...m);
            if (piece != null && piece.team === this.team) {
                continue;
            }

            let include = true;
            for (const supporter of this.detail.cell_supporters(...m)) {
                const supportingPiece = this.detail.piece(...supporter);
                if (
                    supportingPiece &&
                    supportingPiece != this &&
                    supportingPiece.team !== this.team
                ) {
                    include = false;
                    break;
                }
            }
            if (!include) {
                continue;
            }
            yield m;
        }

        if (!this.detail.cell_touched(r, f)) {
            // TODO: if checked, we can't castle
            yield* this.getCastleMoves(r, f, 0, -1);
            yield* this.getCastleMoves(r, f, 7, +1);
        }
    }

    *getCastleMoves(
        r: number,
        f: number,
        rookfile: number,
        delta: number
    ): Generator<[number, number]> {
        if (this.detail.cell_inbound(r, f) && !this.detail.cell_touched(r, rookfile)) {
            for (let i = f + delta; i != rookfile; i += delta) {
                if (this.detail.piece(r, i)) {
                    return;
                }
                if (i !== f + delta * 3) {
                    for (const supporter of this.detail.cell_supporters(r, i)) {
                        const supportingPiece = this.detail.piece(...supporter);
                        if (supportingPiece && supportingPiece.team != this.team) {
                            return;
                        }
                    }
                }
            }
            yield [r, f + delta * 2];
        }
    }

    *getSupportingMoves(r: number, f: number): Generator<[number, number]> {
        for (const m of this.movesCollect(r, f)) {
            if (!this.detail.cell_inbound(...m)) {
                continue;
            }
            const piece = this.detail.piece(...m);
            if (piece != null && piece.team !== this.team) {
                continue;
            }

            yield m;
        }
    }

    *movesCollect(r: number, f: number): Generator<[number, number]> {
        // rank/file
        yield [r + 1, f + 0];
        yield [r - 1, f + 0];
        yield [r + 0, f + 1];
        yield [r + 0, f - 1];

        // diagonal
        yield [r + 1, f + 1];
        yield [r - 1, f + 1];
        yield [r + 1, f - 1];
        yield [r - 1, f - 1];
    }

    move(from: [number, number], to: [number, number]): Move {
        if (from[0] == to[0] && Math.abs(from[1] - to[1]) === 2) {
            const mv = new GroupMove();
            const rookfile = from[1] > to[1] ? 0 : 7;
            const delta = from[1] > to[1] ? -1 : +1;
            mv.add(this.detail.move_take([from[0], rookfile], [to[0], from[1] + delta]));
            mv.add(this.detail.move_take(from, to));
            return mv;
        }
        return this.detail.move_take(from, to);
    }
}
