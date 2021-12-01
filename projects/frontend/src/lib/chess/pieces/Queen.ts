import type { GameDetail } from '$lib/chess/Piece';
import RangedPiece from '$lib/chess/pieces/RangedPiece';

export default class Queen extends RangedPiece {
    constructor(team: boolean, detail: GameDetail) {
        super('Q', team, detail, [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1]
        ]);
    }
}
