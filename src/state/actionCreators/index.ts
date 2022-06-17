import { ActionType, CellMovementDirection } from '../actionTypes';
import {
    Action,
    MoveCellAction,
    DeleteCellAction,
    UpdateCellAction
} from '../actions';

export const updateCell = (
    id: string,
    content: string
): UpdateCellAction => {
    return {
        type: ActionType.UPDATE_CELL,
        payload: {
            id,
            content
        }
    };
};

export const deleteCell = (id: string): DeleteCellAction => {
    return {
        type: ActionType.DELETE_CELL,
        payload: id
    };
};

export const moveCell = (
    id: string,
    direction: CellMovementDirection
): MoveCellAction => {
    return {
        type: ActionType.MOVE_CELL,
        payload: {
            id,
            direction
        }
    };
};
