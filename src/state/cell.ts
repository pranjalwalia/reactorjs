export type CellType = 'text' | 'code';
export type CellMovementDirection = 'up' | 'down';

export interface Cell {
    id: string;
    type: CellType;
    content: string;
}
