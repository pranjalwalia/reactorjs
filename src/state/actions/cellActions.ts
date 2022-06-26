import { CellActionType } from '../actionTypes';
import { Cell, CellMovementDirection, CellType } from '../cell';
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

export interface FetchCellsAction {
    type: CellActionType.FETCH_CELLS;
}

export interface FetchCellsCompleteAction {
    type: CellActionType.FETCH_CELLS_COMPLETE;
    payload: Cell[];
}

export interface FetchCellsErrorAction {
    type: CellActionType.FETCH_CELLS_ERROR;
    payload: string;
}

export interface SaveCellsErrorAction {
    type: CellActionType.SAVE_CELLS_ERROR;
    payload: string;
}

export type Action =
    | MoveCellAction
    | DeleteCellAction
    | UpdateCellAction
    | InsertCellAfterAction
    | FetchCellsAction
    | FetchCellsCompleteAction
    | FetchCellsErrorAction
    | SaveCellsErrorAction;
