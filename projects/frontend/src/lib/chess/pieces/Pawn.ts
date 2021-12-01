import type { GameDetail, Move } from '$lib/chess/Piece';
import { Piece } from '$lib/chess/Piece';

type MoveTransformer = (r: number, f: number, rdelta: number, fdelta: number) => [number, number];

export default class Pawn extends Piece {
    transform: MoveTransformer;

    constructor(team: boolean, detail: GameDetail, moveTransformer: MoveTransformer) {
        super('P', team, detail);
        this.transform = moveTransformer;
    }

    *getAttackingMoves(r: number, f: number): Generator<[number, number]> {
        const nextCell = this.transform(r, f, 1, 0);
        if (this.detail.cell.inbound(nextCell[0], nextCell[1])) {
            if (this.detail.piece(nextCell[0], nextCell[1]) == null) {
                yield nextCell;
            }
        }

        const diagonalCheck = (p: [number, number]) => {
            const piece = this.detail.piece(p[0], p[1]);
            return piece && piece.team !== this.team;
        };

        yield* this.diagonalMove(this.transform(r, f, 1, 1), diagonalCheck);
        yield* this.diagonalMove(this.transform(r, f, 1, -1), diagonalCheck);

        if (!this.detail.cell.touched(r, f)) {
            const forward1 = this.transform(r, f, 1, 0);
            if (this.detail.cell.inbound(...forward1) && this.detail.piece(...forward1) == null) {
                const forward2 = this.transform(r, f, 2, 0);
                if (
                    this.detail.cell.inbound(...forward2) &&
                    this.detail.piece(...forward2) == null
                ) {
                    yield forward2;
                }
            }
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
        if (this.detail.cell.inbound(rank, file)) {
            if (!predicate || predicate([rank, file])) {
                yield [rank, file];
            }
        }
    }

    move(from: [number, number], to: [number, number]): Move {
        return this.detail.move(from, to);
    }
}
