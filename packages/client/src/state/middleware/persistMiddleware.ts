import { Dispatch } from 'redux';

import { saveCellsAction } from '../actionCreators';
import { Action } from '../actions';
import { CellActionType } from '../actionTypes';
import { RootState } from '../reducers';

type Next = (action: Action) => void;
type ReturnType = (next: Next) => (action: Action) => void;
type Args = { dispatch: Dispatch<Action>; getState: () => RootState };

const persistMiddleware = ({ dispatch, getState }: Args): ReturnType => {
    let timer: NodeJS.Timeout;

    return (next: Next) => {
        return (action: Action) => {
            next(action);

            const actions = [
                CellActionType.MOVE_CELL,
                CellActionType.UPDATE_CELL,
                CellActionType.INSERT_CELL_AFTER,
                CellActionType.DELETE_CELL
            ];

            if (actions.includes(action.type)) {
                if (timer) {
                    clearTimeout(timer);
                }

                timer = setTimeout(() => {
                    saveCellsAction()(dispatch, getState);
                }, 2000);
            }
        };
    };
};

export { persistMiddleware };
