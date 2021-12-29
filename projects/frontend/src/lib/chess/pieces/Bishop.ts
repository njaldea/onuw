import type { IBoardPieceBridge } from '$lib/game/IBoardPieceBridge';
import RangedPiece from '$lib/chess/pieces/RangedPiece';

export default class Bishop extends RangedPiece {
    public constructor(team: boolean, bridge: IBoardPieceBridge) {
        super('B', team, bridge, [
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1]
        ]);
    }
}
