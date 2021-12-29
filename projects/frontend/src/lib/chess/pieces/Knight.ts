import type { IBoardPieceBridge } from '$lib/game/IBoardPieceBridge';
import type { IMove } from '$lib/game/IMove';
import { GamePiece, Piece } from '$lib/game/Piece';

export default class Knight extends GamePiece {
    public constructor(team: boolean, bridge: IBoardPieceBridge) {
        super('N', team, bridge);
    }

    override *getAttackingMoves(r: number, f: number): Generator<[number, number]> {
        yield* this.movesCollect(r, f, (piece: Piece) => piece.team !== this.team);
    }

    override *getSupportingMoves(r: number, f: number): Generator<[number, number]> {
        yield* this.movesCollect(r, f, (piece: Piece) => piece.team === this.team);
    }

    override move(from: [number, number], to: [number, number]): IMove {
        return this.bridge.move_take(from, to);
    }

    private *movesCollect(
        r: number,
        f: number,
        predicate: (piece: Piece) => boolean
    ): Generator<[number, number]> {
        const deltas = [-2, -1, 1, 2];
        for (const rd of deltas) {
            for (const fd of deltas) {
                if (Math.abs(rd) === Math.abs(fd)) {
                    continue;
                }

                const cell: [number, number] = [r + rd, f + fd];
                if (this.bridge.cell_inbound(...cell)) {
                    const otherpiece = this.bridge.piece(...cell);
                    if (otherpiece == null || predicate(otherpiece)) {
                        yield cell;
                    }
                }
            }
        }
    }
}
