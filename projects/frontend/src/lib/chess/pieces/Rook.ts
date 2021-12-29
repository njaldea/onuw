import type { IBoardPieceBridge } from '$lib/game/IBoardPieceBridge';
import RangedPiece from '$lib/chess/pieces/RangedPiece';

export default class Rook extends RangedPiece {
    public constructor(team: boolean, bridge: IBoardPieceBridge) {
        super('R', team, bridge, [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ]);
    }
}
