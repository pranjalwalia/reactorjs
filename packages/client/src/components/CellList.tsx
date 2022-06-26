import '../styles/CellList.css';
import { Fragment, useEffect } from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import CellListItem from './CellListitem';
import AddCell from './AddCell';
import { useActions } from '../hooks';
export interface CellListProps {}

const CellList: React.FC<CellListProps> = () => {
    const cells = useTypedSelector(({ cells: { order, data } }) =>
        order.map((id) => data[id])
    );

    const { fetchCellsAction } = useActions();

    useEffect(() => {
        fetchCellsAction();
    }, [fetchCellsAction]);

    const renderedCells = cells.map((cell) => (
        <Fragment key={cell.id}>
            <CellListItem cell={cell} />
            <AddCell previousCellId={cell.id} />
        </Fragment>
    ));

    return (
        <div className="cell-list">
            <AddCell previousCellId={null} forceVisible={cells.length === 0} />
            {renderedCells}
        </div>
    );
};

export default CellList;
