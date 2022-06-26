export enum CellActionType {
    MOVE_CELL = 'move_cell',
    DELETE_CELL = 'delete_cell',
    UPDATE_CELL = 'update_cell',
    INSERT_CELL_AFTER = 'insert_cell_after'
}

export enum BundleActionType {
    BUNDLE_START = 'bundle_start',
    BUNDLE_COMPLETE = 'bundle_complete'
}

export type CellType = 'text' | 'code';
export type CellMovementDirection = 'up' | 'down';
