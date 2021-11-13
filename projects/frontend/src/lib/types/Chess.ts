export type Piece = {
    role: string;
    team: boolean;
    getPossibleMoves: (r: number, f: number) => [number, number][];
};

export type CellDetail = {
    id: number;
    piece: null|Piece;
    position: [number, number];
    targeted: boolean;
};
