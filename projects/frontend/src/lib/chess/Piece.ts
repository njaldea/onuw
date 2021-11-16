export type PieceGetter = (r: number, f: number) => Piece;
export type CellBoundCheck = (r: number, f: number) => boolean;

export abstract class Piece {
    constructor(r: string, t: boolean, isCellInBound: CellBoundCheck, pieceGetter: PieceGetter) {
        this.role = r;
        this.team = t;
        this.hasMoved = false;
        this.pieceGetter = pieceGetter;
        this.isCellInBound = isCellInBound;
    }

    role: string;
    team: boolean;
    hasMoved: boolean;
    pieceGetter: PieceGetter;
    isCellInBound: CellBoundCheck;

    abstract getPossibleMoves(r: number, f: number): Generator<[number, number]>;
    abstract getSupportingMoves(r: number, f: number): Generator<[number, number]>;
}

function* getMoves(
    self: Piece,
    r: number,
    f: number,
    rd: number,
    fd: number,
    limit: null | number,
    supporting: boolean
): Generator<[number, number]> {
    for (let i = 0; limit == null || i < limit; ++i) {
        const rank = r + rd * (i + 1);
        const file = f + fd * (i + 1);
        if (self.isCellInBound(rank, file)) {
            const piece = self.pieceGetter(rank, file);
            if (piece != null && piece.team === self.team) {
                if (supporting) {
                    yield [rank, file];
                }
                break;
            }
            yield [rank, file];
            if (piece != null) {
                break;
            }
        } else {
            break;
        }
    }
}

export function* getPossibleMoves(
    self: Piece,
    r: number,
    f: number,
    rd: number,
    fd: number,
    limit: null | number = null
): Generator<[number, number]> {
    yield* getMoves(self, r, f, rd, fd, limit, false);
}

export function* getSupportingMoves(
    self: Piece,
    r: number,
    f: number,
    rd: number,
    fd: number,
    limit: null | number = null
): Generator<[number, number]> {
    yield* getMoves(self, r, f, rd, fd, limit, true);
}
