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

    getPossibleMoves(r: number, f: number): [number, number][] {
        const retval: [number, number][] = [];

        const nextCell = this.transform(r, f, 1, 0);
        if (this.isCellInBound(nextCell[0], nextCell[1])) {
            if (this.pieceGetter(nextCell[0], nextCell[1]) == null) {
                retval.push(nextCell);
            }

            if (this.hasMoved === false && retval.length === 1) {
                const nextNextCell = this.transform(r, f, 2, 0);
                if (
                    this.isCellInBound(nextNextCell[0], nextNextCell[1]) &&
                    this.pieceGetter(nextNextCell[0], nextNextCell[1]) == null
                ) {
                    retval.push(nextNextCell);
                }
            }

            const diagonalCheck = (p: [number, number]) => {
                const piece = this.pieceGetter(p[0], p[1]);
                return piece && piece.team !== this.team;
            };

            this.addCell(retval, this.transform(r, f, 1, 1), diagonalCheck);
            this.addCell(retval, this.transform(r, f, 1, -1), diagonalCheck);
        }

        return retval;
    }

    getSupportingMoves(r: number, f: number): [number, number][] {
        const retval: [number, number][] = [];

        this.addCell(retval, this.transform(r, f, 1, 1), () => true);
        this.addCell(retval, this.transform(r, f, 1, -1), () => true);

        return retval;
    }

    addCell(
        out: [number, number][],
        [rank, file]: [number, number],
        predicate: (p: [number, number]) => boolean
    ): void {
        if (this.isCellInBound(rank, file)) {
            if (predicate([rank, file])) {
                out.push([rank, file]);
            }
        }
    }
}
