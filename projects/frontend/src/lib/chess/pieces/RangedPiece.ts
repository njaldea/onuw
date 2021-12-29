import type { IBoardPieceBridge } from '$lib/game/IBoardPieceBridge';
import type { IMove } from '$lib/game/IMove';
import { GamePiece } from '$lib/game/Piece';

function* getMoves(
    self: GamePiece,
    r: number,
    f: number,
    rd: number,
    fd: number,
    limit: null | number
): Generator<[number, number]> {
    for (let i = 0; limit == null || i < limit; ++i) {
        const rank = r + rd * (i + 1);
        const file = f + fd * (i + 1);
        if (self.bridge.cell_inbound(rank, file)) {
            yield [rank, file];
        } else {
            break;
        }
    }
}

export function* getAttackingMoves(
    self: GamePiece,
    r: number,
    f: number,
    rd: number,
    fd: number,
    limit: null | number = null
): Generator<[number, number]> {
    for (const move of getMoves(self, r, f, rd, fd, limit)) {
        const piece = self.bridge.piece(move[0], move[1]);
        if (piece == null || piece.team !== self.team) {
            yield move;
        }
        if (piece != null) {
            break;
        }
    }
}

export function* getSupportingMoves(
    self: GamePiece,
    r: number,
    f: number,
    rd: number,
    fd: number,
    limit: null | number = null
): Generator<[number, number]> {
    for (const move of getMoves(self, r, f, rd, fd, limit)) {
        const piece = self.bridge.piece(...move);
        if (piece == null || piece.team === self.team) {
            yield move;
        }
        if (piece != null && piece.role !== 'K') {
            break;
        }
    }
}

export default class RangedPiece extends GamePiece {
    private directions: [number, number][];

    public constructor(
        role: string,
        team: boolean,
        bridge: IBoardPieceBridge,
        directions: [number, number][]
    ) {
        super(role, team, bridge);
        this.directions = directions;
    }

    override *getAttackingMoves(r: number, f: number): Generator<[number, number]> {
        for (const direction of this.directions) {
            yield* getAttackingMoves(this, r, f, ...direction);
        }
    }

    override *getSupportingMoves(r: number, f: number): Generator<[number, number]> {
        for (const direction of this.directions) {
            yield* getSupportingMoves(this, r, f, ...direction);
        }
    }

    override move(from: [number, number], to: [number, number]): IMove {
        return this.bridge.move_take(from, to);
    }
}
