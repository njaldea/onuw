import type { IBoardPieceBridge } from '$lib/game/IBoardPieceBridge';
import { GroupMove, IMove } from '$lib/game/IMove';
import { GamePiece } from '$lib/game/Piece';

export default class King extends GamePiece {
    public constructor(team: boolean, bridge: IBoardPieceBridge) {
        super('K', team, bridge);
    }

    override *getAttackingMoves(r: number, f: number): Generator<[number, number]> {
        for (const m of this.movesCollect(r, f)) {
            if (!this.bridge.cell_inbound(...m)) {
                continue;
            }
            const piece = this.bridge.piece(...m);
            if (piece != null && piece.team === this.team) {
                continue;
            }

            let include = true;
            for (const supporter of this.bridge.cell_supporters(...m)) {
                const supportingPiece = this.bridge.piece(...supporter);
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

        if (!this.bridge.cell_touched(r, f)) {
            // TODO: if checked, we can't castle
            yield* this.getCastleMoves(r, f, 0, -1);
            yield* this.getCastleMoves(r, f, 7, +1);
        }
    }

    override *getSupportingMoves(r: number, f: number): Generator<[number, number]> {
        for (const m of this.movesCollect(r, f)) {
            if (!this.bridge.cell_inbound(...m)) {
                continue;
            }
            const piece = this.bridge.piece(...m);
            if (piece != null && piece.team !== this.team) {
                continue;
            }

            yield m;
        }
    }

    override move(from: [number, number], to: [number, number]): IMove {
        if (from[0] == to[0] && Math.abs(from[1] - to[1]) === 2) {
            const mv = new GroupMove();
            const rookfile = from[1] > to[1] ? 0 : 7;
            const delta = from[1] > to[1] ? -1 : +1;
            mv.add(this.bridge.move_take([from[0], rookfile], [to[0], from[1] + delta]));
            mv.add(this.bridge.move_take(from, to));
            return mv;
        }
        return this.bridge.move_take(from, to);
    }

    private *movesCollect(r: number, f: number): Generator<[number, number]> {
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

    private *getCastleMoves(
        r: number,
        f: number,
        rookfile: number,
        delta: number
    ): Generator<[number, number]> {
        if (
            this.bridge.cell_inbound(r, f) &&
            !this.bridge.cell_touched(r, rookfile) &&
            this.bridge.piece(r, rookfile)
        ) {
            for (let i = f + delta; i != rookfile; i += delta) {
                if (this.bridge.piece(r, i)) {
                    return;
                }
                if (i !== f + delta * 3) {
                    for (const supporter of this.bridge.cell_supporters(r, i)) {
                        const supportingPiece = this.bridge.piece(...supporter);
                        if (supportingPiece && supportingPiece.team != this.team) {
                            return;
                        }
                    }
                }
            }
            yield [r, f + delta * 2];
        }
    }
}
