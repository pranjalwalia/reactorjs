import '../styles/ExecutionCell.css';
import { ReactElement, useState, useEffect } from 'react';
import { engineGenerateBundledCode, IBundlerResponse } from '../services/engine/buildEngine';
import Preview from './Preview';
import Editor from '../components/CodeEditor';
import ResizableWrapper from './ResizableWrapper';

export const ExecutionCell: React.FC<{}> = (): ReactElement | null => {
    const [inputCode, setInputCode] = useState<string>('');
    const [bundledCode, setBundledCode] = useState<string | null>('');
    const [errors, setErrors] = useState<string>('');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const bundlerInitialize = async (): Promise<void> => {
        if (!inputCode) {
            return;
        }
        const res: IBundlerResponse = await engineGenerateBundledCode(inputCode);
        setBundledCode(res.code);
        setErrors(res.error);
    };

    useEffect(() => {
        if (!bundledCode) {
            bundlerInitialize();
            return;
        }

        const timer = setTimeout(async () => {
            bundlerInitialize();
            // console.log('timed out bruh');
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bundledCode, bundlerInitialize]);

    return (
        <>
            <ResizableWrapper direction="vertical">
                <div style={{ height: 'calc(100% - 10px)', display: 'flex', flexDirection: 'row' }}>
                    <ResizableWrapper direction="horizontal">
                        <Editor
                            onChange={(value: string) => setInputCode(value)}
                            initialValue="import React from 'react';
                                                     import { render } from 'react-dom';
                                                     render(<h1>Hello, world!</h1>,document.getElementById('root'));"
                        />
                    </ResizableWrapper>
                    {!bundledCode ? (
                        <div className="progress-wrapper">
                            <div className="progress-cover">
                                <progress className="progress is-small is-primary">
                                    Loading
                                </progress>
                            </div>
                        </div>
                    ) : (
                        <Preview code={bundledCode} bundlingStatus={errors} />
                    )}
                </div>
            </ResizableWrapper>
            {/* <div>
                <button onClick={bundlerInitialize}>Submit</button>
            </div> */}
        </>
    );

    // return (
    //     <>
    //         <ResizableWrapper direction="vertical">
    //             <div className="execution-cell">
    //                 <ResizableWrapper direction="horizontal">
    //                     <Editor
    //                         initialValue="import React from 'react';
    //                             import { render } from 'react-dom';
    //                             render(<h1>Hello, world!</h1>,document.getElementById('root'));"
    //                         onChange={(value: string) => setInputCode(value)}
    //                     />
    //                 </ResizableWrapper>
    //             </div>
    //             <div>
    //                 <button onClick={bundlerInitialize}>Submit</button>
    //             </div>
    //             {bundledCode ? (
    //                 <Preview code={bundledCode} bundlingStatus="success" />
    //             ) : (
    //                 <div className="progress-wrapper">
    //                     <div className="progress-cover">
    //                         <progress className="progress is-small is-primary">Loading</progress>
    //                     </div>
    //                 </div>
    //             )}
    //         </ResizableWrapper>
    //     </>
    // );
};
