import {
    ActionType,
    CellMovementDirection,
    CellType
} from '../actionTypes';

export interface MoveCellAction {
    type: ActionType.MOVE_CELL;
    payload: {
        id: string;
        direction: CellMovementDirection;
    };
}

export interface DeleteCellAction {
    type: ActionType.DELETE_CELL;
    payload: string;
}

export interface UpdateCellAction {
    type: ActionType.UPDATE_CELL;
    payload: {
        id: string;
        content: string;
    };
}

export interface InsertCellAfterAction {
    type: ActionType.INSERT_CELL_AFTER;
    payload: {
        id: string;
        type: CellType;
    };
}

export type Action =
    | MoveCellAction
    | DeleteCellAction
    | UpdateCellAction
    | InsertCellAfterAction;
