import './styles/ResizableWrapper.css';

import { ReactElement, useState } from 'react';
import { engineGenerateBundledCode } from '../services/engine/buildEngine';

import Preview from './Preview';
import Editor from '../containers/CodeEditor';
import ResizableWrapper from './ResizableWrapper';

export const ExecutionCell: React.FC<{}> = (): ReactElement | null => {
    const [inputCode, setInputCode] = useState<string>('');
    const [bundledCode, setBundledCode] = useState<string | null>('');

    const bundlerInitialize = async (): Promise<void> => {
        if (!inputCode) {
            return;
        }
        const res = await engineGenerateBundledCode(inputCode);
        setBundledCode(res);
    };
    bundlerInitialize();
    return (
        <ResizableWrapper direction="vertical">
            <div className="execution-cell">
                <ResizableWrapper direction="horizontal">
                    <Editor
                        initialValue="import React from 'react';
                                import { render } from 'react-dom';
                                render(<h1>Hello, world!</h1>,document.getElementById('root'));"
                        executableCodeOnChangeHandler={(value: string) => setInputCode(value)}
                    />
                </ResizableWrapper>
            </div>
            {bundledCode ? (
                <Preview bundledCode={bundledCode ? bundledCode : ''} />
            ) : (
                <div className="progress-wrapper">
                    <div className="progress-cover">
                        <progress className="progress is-small is-primary">Loading</progress>
                    </div>
                </div>
            )}
        </ResizableWrapper>
    );
};
