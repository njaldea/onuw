export type PieceGetter = (r: number, f: number) => Piece;
export type CellBoundCheck = (r: number, f: number) => boolean;

export abstract class Piece {
	constructor(r: string, t: boolean, isCellInBound: CellBoundCheck, pieceGetter: PieceGetter) {
		this.role = r;
		this.team = t;
		this.hasMoved = false;
		this.pieceGetter = pieceGetter;
		this.isCellInBound = isCellInBound;
	}

	role: string;
	team: boolean;
	hasMoved: boolean;
	pieceGetter: PieceGetter;
	isCellInBound: CellBoundCheck;

	abstract getPossibleMoves(r: number, f: number): [number, number][];
	abstract getSupportingMoves(r: number, f: number): [number, number][];
}
