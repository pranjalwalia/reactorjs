import { ReactElement, useState, useEffect } from 'react';
import { initializeService, engineGenerateBundledCode } from '../services/engine/buildEngine';

import Preview from '../components/Preview';
import Editor from '../containers/CodeEditor';

export const ExecutionCell: React.FC<{}> = (): ReactElement | null => {
    const [inputCode, setInputCode] = useState<string>('');
    const [bundledCode, setBundledCode] = useState<string | null>('');

    useEffect((): void => {
        initializeService();
    }, []);

    const bundlerInitialize = async (): Promise<void> => {
        if (!inputCode) {
            return;
        }
        const res = await engineGenerateBundledCode(inputCode);
        setBundledCode(res);
    };

    return (
        <div>
            <div>
                <Editor
                    initialValue="import React from 'react'; 
                                    import { render } from 'react-dom';
                                    render(<h1>Hello, world!</h1>,document.getElementById('root'));"
                    executableCodeOnChangeHandler={(value: string) => setInputCode(value)}
                />
            </div>
            <div>
                <button onClick={bundlerInitialize}>Submit</button>
            </div>
            <div>{bundledCode ? <Preview bundledCode={bundledCode} /> : null}</div>
        </div>
    );
};
