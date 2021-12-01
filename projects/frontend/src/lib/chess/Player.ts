import type { GameDetail, Piece } from '$lib/chess/Piece';

import Pawn from './pieces/Pawn';
import Knight from './pieces/Knight';
import Rook from './pieces/Rook';
import Bishop from './pieces/Bishop';
import Queen from './pieces/Queen';
import King from './pieces/King';

export class Player {
    king: Piece;
    queen: Piece;
    bishop: Piece;
    knight: Piece;
    rook: Piece;
    pawn: Piece;

    constructor(team: boolean, gamedetail: GameDetail) {
        // assumes white always at rank 0
        const transform = (
            r: number,
            f: number,
            rdelta: number,
            fdelta: number
        ): [number, number] => {
            return this.king.team ? [r + rdelta, f + fdelta] : [r - rdelta, f - fdelta];
        };

        this.king = new King(team, gamedetail);
        this.queen = new Queen(team, gamedetail);
        this.bishop = new Bishop(team, gamedetail);
        this.knight = new Knight(team, gamedetail);
        this.rook = new Rook(team, gamedetail);
        this.pawn = new Pawn(team, gamedetail, transform);
    }
}
