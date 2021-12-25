import type { Piece } from '$lib/game/Piece';

import Pawn from '$lib/chess/pieces/Pawn';
import Knight from '$lib/chess/pieces/Knight';
import Rook from '$lib/chess/pieces/Rook';
import Bishop from '$lib/chess/pieces/Bishop';
import Queen from '$lib/chess/pieces/Queen';
import King from '$lib/chess/pieces/King';
import type { IBoardPieceBridge } from '$lib/game/IBoardPieceBridge';

export class Player {
    king: Piece;
    queen: Piece;
    bishop: Piece;
    knight: Piece;
    rook: Piece;
    pawn: Piece;

    constructor(team: boolean, bridge: IBoardPieceBridge) {
        // assumes white always at rank 0
        const transform = (
            r: number,
            f: number,
            rdelta: number,
            fdelta: number
        ): [number, number] => {
            return this.king.team ? [r + rdelta, f + fdelta] : [r - rdelta, f - fdelta];
        };

        this.king = new King(team, bridge);
        this.queen = new Queen(team, bridge);
        this.bishop = new Bishop(team, bridge);
        this.knight = new Knight(team, bridge);
        this.rook = new Rook(team, bridge);
        this.pawn = new Pawn(team, bridge, transform);
    }
}
