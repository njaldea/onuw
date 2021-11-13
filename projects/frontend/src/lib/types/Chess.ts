export type PieceGetter = (r: number, f: number) => Piece;

export abstract class Piece
{
    constructor(r: string, t: boolean, pieceGetter: PieceGetter)
    {
        this.role = r;
        this.team = t;
        this.hasMoved = false;
        this.pieceGetter = pieceGetter;
    }

    role: string;
    team: boolean;
    hasMoved: boolean;
    pieceGetter: PieceGetter;

    abstract getPossibleMoves(r: number, f: number): [number, number][];
    abstract getSupportingMoves(r: number, f: number): [number, number][];
};

export type CellDetail = {
    id: number;
    piece: null|Piece;
    position: [number, number];
    targeted: boolean;
    coveredby: [number, number][];
};
