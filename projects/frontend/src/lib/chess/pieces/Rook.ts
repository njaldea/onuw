import type { Detail } from '$lib/chess/game/Detail';
import RangedPiece from '$lib/chess/pieces/RangedPiece';

export default class Rook extends RangedPiece {
    constructor(team: boolean, detail: Detail) {
        super('R', team, detail, [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ]);
    }
}
