import type { Detail, Move } from '$lib/chess/game/Detail';
import { Piece } from '$lib/chess/Piece';

export default class Knight extends Piece {
    constructor(team: boolean, detail: Detail) {
        super('N', team, detail);
    }

    *getAttackingMoves(r: number, f: number): Generator<[number, number]> {
        yield* this.movesCollect(r, f, (piece: Piece) => piece.team !== this.team);
    }

    *getSupportingMoves(r: number, f: number): Generator<[number, number]> {
        yield* this.movesCollect(r, f, (piece: Piece) => piece.team === this.team);
    }

    *movesCollect(
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
                if (this.detail.cell_inbound(...cell)) {
                    const otherpiece = this.detail.piece(...cell);
                    if (otherpiece == null || predicate(otherpiece)) {
                        yield cell;
                    }
                }
            }
        }
    }

    move(from: [number, number], to: [number, number]): Move {
        return this.detail.move_take(from, to);
    }
}
