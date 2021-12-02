import type { Detail } from '$lib/chess/game/Detail';
import RangedPiece from '$lib/chess/pieces/RangedPiece';

export default class Queen extends RangedPiece {
    constructor(team: boolean, detail: Detail) {
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
