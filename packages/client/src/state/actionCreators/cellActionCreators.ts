import { Dispatch } from 'redux';
import { RootState } from '../reducers';
import { Cell, CellMovementDirection, CellType } from '../cell';
import { CellActionType } from '../actionTypes';

import {
    Action,
    MoveCellAction,
    DeleteCellAction,
    UpdateCellAction,
    InsertCellAfterAction
} from '../actions';

import axios from 'axios';

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

export const fetchCellsAction = () => {
    return async (dispatch: Dispatch<Action>): Promise<void> => {
        dispatch({ type: CellActionType.FETCH_CELLS });

        try {
            const { data }: { data: Cell[] } = await axios.get('/cells');

            dispatch({
                type: CellActionType.FETCH_CELLS_COMPLETE,
                payload: data
            });
        } catch (error: any) {
            dispatch({
                type: CellActionType.FETCH_CELLS_ERROR,
                payload: error.message
                    ? error.message
                    : 'FETCH_CELLS_ERROR: ' + error
            });
        }
    };
};

export const saveCellsAction = () => {
    return async (
        dispatch: Dispatch<Action>,
        getState: () => RootState
    ): Promise<void> => {
        const {
            cells: { data, order }
        } = getState();

        const cells = order.map((id) => data[id]);

        try {
            await axios.post('/cells', { cells });
        } catch (error: any) {
            dispatch({
                type: CellActionType.SAVE_CELLS_ERROR,
                payload: error.message
                    ? error.message
                    : 'SAVE_CELLS_ERROR: ' + error
            });
        }
    };
};
