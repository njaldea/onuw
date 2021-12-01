/**
 * Piece generally knows only rank/file position [number, number]
 * Also, Piece does not know anything about Cells. It only serves
 * as a collection of method of a piece type. multiple instances if piece type
 * on board is using the same instance of Piece.
 *
 * GameDetail is introduced so that it can inspect Cells and other pieces on board.
 * These implementations are injected to avoid cyclic import of Cell.ts and Piece.ts
 * and to generally isolate the responsibility if Piece from Cell.
 */

type CellTouched = (r: number, f: number) => boolean;
type CellBoundCheck = (r: number, f: number) => boolean;
type CellSupporters = (r: number, f: number) => [number, number][];
type PieceGetter = (r: number, f: number) => Piece;

export type Move = {
    execute: () => boolean;
    revert: () => boolean;
};
type MoveCreator = (from: [number, number], to: [number, number]) => Move;

export type GameDetail = {
    cell: {
        touched: CellTouched;
        inbound: CellBoundCheck;
        supporters: CellSupporters;
    };
    piece: PieceGetter;
    move: MoveCreator;
};

export abstract class Piece {
    constructor(r: string, t: boolean, detail: GameDetail) {
        this.role = r;
        this.team = t;
        this.detail = detail;
    }

    role: string;
    team: boolean;
    detail: GameDetail;

    abstract getAttackingMoves(r: number, f: number): Generator<[number, number]>;
    abstract getSupportingMoves(r: number, f: number): Generator<[number, number]>;
    abstract move(from: [number, number], to: [number, number]): Move;
}
