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

export class Cell {
	constructor(i: number, pos: [number, number]) {
		this.id = i;
		this.piece = null;
		this.targeted = false;
		this.position = pos;
		this.coveredby = [];
	}

	id: number;
	piece: null | Piece;
	targeted: boolean;
	position: [number, number];
	coveredby: number[];
}
