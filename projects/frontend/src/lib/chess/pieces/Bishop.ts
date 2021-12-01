import type { GameDetail } from '$lib/chess/Piece';
import RangedPiece from '$lib/chess/pieces/RangedPiece';

export default class Bishop extends RangedPiece {
    constructor(team: boolean, detail: GameDetail) {
        super('B', team, detail, [
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1]
        ]);
    }
}
