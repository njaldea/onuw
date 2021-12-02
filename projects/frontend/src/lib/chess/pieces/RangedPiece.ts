import type { Detail, Move } from '$lib/chess/game/Detail';
import { Piece } from '$lib/chess/Piece';

function* getMoves(
    self: Piece,
    r: number,
    f: number,
    rd: number,
    fd: number,
    limit: null | number
): Generator<[number, number]> {
    for (let i = 0; limit == null || i < limit; ++i) {
        const rank = r + rd * (i + 1);
        const file = f + fd * (i + 1);
        if (self.detail.cell_inbound(rank, file)) {
            yield [rank, file];
        } else {
            break;
        }
    }
}

export function* getAttackingMoves(
    self: Piece,
    r: number,
    f: number,
    rd: number,
    fd: number,
    limit: null | number = null
): Generator<[number, number]> {
    for (const move of getMoves(self, r, f, rd, fd, limit)) {
        const piece = self.detail.piece(move[0], move[1]);
        if (piece == null || piece.team !== self.team) {
            yield move;
        }
        if (piece != null) {
            break;
        }
    }
}

export function* getSupportingMoves(
    self: Piece,
    r: number,
    f: number,
    rd: number,
    fd: number,
    limit: null | number = null
): Generator<[number, number]> {
    for (const move of getMoves(self, r, f, rd, fd, limit)) {
        const piece = self.detail.piece(...move);
        if (piece == null || piece.team === self.team) {
            yield move;
        }
        if (piece != null && piece.role !== 'K') {
            break;
        }
    }
}

export default class RangedPiece extends Piece {
    directions: [number, number][];
    constructor(role: string, team: boolean, detail: Detail, directions: [number, number][]) {
        super(role, team, detail);
        this.directions = directions;
    }

    *getAttackingMoves(r: number, f: number): Generator<[number, number]> {
        for (const direction of this.directions) {
            yield* getAttackingMoves(this, r, f, ...direction);
        }
    }

    *getSupportingMoves(r: number, f: number): Generator<[number, number]> {
        for (const direction of this.directions) {
            yield* getSupportingMoves(this, r, f, ...direction);
        }
    }

    move(from: [number, number], to: [number, number]): Move {
        return this.detail.move(from, to);
    }
}
