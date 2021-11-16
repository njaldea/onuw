import type { PieceGetter, CellBoundCheck } from '$lib/chess/Piece';
import { Piece } from '$lib/chess/Piece';

type MoveTransformer = (r: number, f: number, rdelta: number, fdelta: number) => [number, number];

export default class Pawn extends Piece {
    transform: MoveTransformer;

    constructor(
        team: boolean,
        isCellInBound: CellBoundCheck,
        pieceGetter: PieceGetter,
        moveTransformer: MoveTransformer
    ) {
        super('P', team, isCellInBound, pieceGetter);
        this.transform = moveTransformer;
    }

    *getPossibleMoves(r: number, f: number): Generator<[number, number]> {
        const nextCell = this.transform(r, f, 1, 0);
        if (this.isCellInBound(nextCell[0], nextCell[1])) {
            if (this.pieceGetter(nextCell[0], nextCell[1]) == null) {
                yield nextCell;
            }

            const diagonalCheck = (p: [number, number]) => {
                const piece = this.pieceGetter(p[0], p[1]);
                return piece && piece.team !== this.team;
            };

            yield* this.diagonalMove(this.transform(r, f, 1, 1), diagonalCheck);
            yield* this.diagonalMove(this.transform(r, f, 1, -1), diagonalCheck);
        }
    }

    *getSupportingMoves(r: number, f: number): Generator<[number, number]> {
        yield* this.diagonalMove(this.transform(r, f, 1, 1));
        yield* this.diagonalMove(this.transform(r, f, 1, -1));
    }

    *diagonalMove(
        [rank, file]: [number, number],
        predicate: (p: [number, number]) => boolean = null
    ): Generator<[number, number]> {
        if (this.isCellInBound(rank, file)) {
            if (!predicate || predicate([rank, file])) {
                yield [rank, file];
            }
        }
    }
}
