import type { Detail } from '$lib/chess/game/Detail';
import RangedPiece from '$lib/chess/pieces/RangedPiece';

export default class Bishop extends RangedPiece {
    constructor(team: boolean, detail: Detail) {
        super('B', team, detail, [
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1]
        ]);
    }
}
