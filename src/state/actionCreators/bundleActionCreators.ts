import { Dispatch } from 'redux';
import { BundleActionType } from '../actionTypes';
import BaseBundler from '../../services/engine/buildEngine';
import { BundleAction } from '../actions';

export const createBundleAction = (cellId: string, input: string) => {
    return async (dispatch: Dispatch<BundleAction>) => {
        dispatch({
            type: BundleActionType.BUNDLE_START,
            payload: { cellId }
        });

        const result = await BaseBundler(input);

        dispatch({
            type: BundleActionType.BUNDLE_COMPLETE,
            payload: {
                cellId,
                bundle: result
            }
        });
    };
};
