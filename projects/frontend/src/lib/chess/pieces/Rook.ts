import type { GameDetail } from '$lib/chess/Piece';
import RangedPiece from '$lib/chess/pieces/RangedPiece';

export default class Rook extends RangedPiece {
    constructor(team: boolean, detail: GameDetail) {
        super('R', team, detail, [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ]);
    }
}
