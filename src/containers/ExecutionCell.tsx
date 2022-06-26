import '../styles/ExecutionCell.css';
import { ReactElement, useEffect } from 'react';
import Preview from './Preview';
import Editor from '../components/CodeEditor';
import ResizableWrapper from './ResizableWrapper';

import { Cell } from '../state';
import { useActions, useTypedSelector, useCumulativeCode } from '../hooks';
interface CodeCellProps {
    cell: Cell;
}

export const ExecutionCell: React.FC<CodeCellProps> = ({
    cell
}): ReactElement | null => {
    const { updateCellAction, createBundleAction } = useActions();
    const bundle = useTypedSelector(({ bundles }) => bundles[cell.id]);
    const cumulativeCode = useCumulativeCode(cell.id);

    useEffect(() => {
        if (!bundle) {
            createBundleAction(cell.id, cumulativeCode);
            return;
        }

        const timer = setTimeout(async () => {
            createBundleAction(cell.id, cumulativeCode);
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
        // eslint-disable-next-line
    }, [cumulativeCode, cell.id, createBundleAction]);

    return (
        <>
            <ResizableWrapper direction="vertical">
                <div
                    style={{
                        height: 'calc(100% - 10px)',
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                    <ResizableWrapper direction="horizontal">
                        <Editor
                            onChange={(value) =>
                                updateCellAction(cell.id, value)
                            }
                            initialValue="// To show content you can use show() function ex. show(<h1>Hello World</h1>), PS: react and react-dom are already imported for you."
                        />
                    </ResizableWrapper>
                    {!bundle || bundle.loading ? (
                        <div className="progress-wrapper">
                            <div className="progress-cover">
                                <progress className="progress is-small is-primary">
                                    Loading
                                </progress>
                            </div>
                        </div>
                    ) : (
                        <Preview
                            code={bundle.code}
                            bundlingStatus={bundle.err}
                        />
                    )}
                </div>
            </ResizableWrapper>
        </>
    );
};
