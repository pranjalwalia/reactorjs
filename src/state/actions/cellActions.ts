import {
    CellActionType,
    CellMovementDirection,
    CellType
} from '../actionTypes';

export interface MoveCellAction {
    type: CellActionType.MOVE_CELL;
    payload: {
        id: string;
        direction: CellMovementDirection;
    };
}

export interface DeleteCellAction {
    type: CellActionType.DELETE_CELL;
    payload: string;
}

export interface UpdateCellAction {
    type: CellActionType.UPDATE_CELL;
    payload: {
        id: string;
        content: string;
    };
}

export interface InsertCellAfterAction {
    type: CellActionType.INSERT_CELL_AFTER;
    payload: {
        id: string | null;
        type: CellType;
    };
}

export type Action =
    | MoveCellAction
    | DeleteCellAction
    | UpdateCellAction
    | InsertCellAfterAction;
