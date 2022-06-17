import { CellType } from './actionTypes';

export interface Cell {
    id: string;
    type: CellType;
    content: string;
}
