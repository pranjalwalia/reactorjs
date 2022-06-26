import {
    CellActionType,
    CellMovementDirection,
    CellType
} from '../actionTypes';

import {
    MoveCellAction,
    DeleteCellAction,
    UpdateCellAction,
    InsertCellAfterAction
} from '../actions';

export const updateCellAction = (
    id: string,
    content: string
): UpdateCellAction => {
    return {
        type: CellActionType.UPDATE_CELL,
        payload: {
            id,
            content
        }
    };
};

export const deleteCellAction = (id: string): DeleteCellAction => {
    return {
        type: CellActionType.DELETE_CELL,
        payload: id
    };
};

export const moveCellAction = (
    id: string,
    direction: CellMovementDirection
): MoveCellAction => {
    return {
        type: CellActionType.MOVE_CELL,
        payload: {
            id,
            direction
        }
    };
};

export const insertCellAfterAction = (
    id: string | null,
    type: CellType
): InsertCellAfterAction => ({
    type: CellActionType.INSERT_CELL_AFTER,
    payload: {
        id,
        type
    }
});
