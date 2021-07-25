import 'bulmaswatch/superhero/bulmaswatch.min.css';
import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { initializeService, engineGenerateBundledCode } from '../services/engine/buildEngine';
import { iFrameIdentifier } from '../utils/sandboxNameGenerator';

// import Preview from '../components/Preview';
import Editor from '../containers/CodeEditor';

export const App: React.FC<{}> = (): ReactElement | null => {
    const [inputCode, setInputCode] = useState<string>('');
    const [bundledCode, setBundledCode] = useState<string | null>('');

    const iFrameRef = useRef<any>();

    useEffect((): void => {
        initializeService();
    }, []);

    const bundlerInitialize = async (): Promise<void> => {
        if (!inputCode) {
            return;
        }
        const res = await engineGenerateBundledCode(inputCode);
        setBundledCode(res);
        iFrameRef.current.contentWindow.postMessage(res, '*');
    };

    const iFramePayload: string = `
    <html>
        <head></head>
        <body>
            <div id="root">
                <script>
                    window.addEventListener('message', (event) => {
                        try {
                            eval(event.data);
                          } catch (err) {
                            const root = document.querySelector('#root');
                            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
                            console.error(err);
                          }
                    }, false)
                </script>
            </div>
        </body>
    </html>`;

    const iFrameTitle: string = `iframe-${iFrameIdentifier(iFramePayload.length % 123)}`;

    return (
        <div>
            <div>
                <Editor
                    initialValue="import React from 'react'; import { render } from 'react-dom';
                                render(
                                    <h1>Hello, world!</h1>,
                                    document.getElementById('root')
                                );"
                    executableCodeOnChangeHandler={(value: string) => setInputCode(value)}
                />
            </div>
            <div>
                <button onClick={bundlerInitialize}>Submit</button>
            </div>
            <div>
                {/* {bundledCode ? <Preview bundledCode={bundledCode} /> : null} */}
                <iframe
                    ref={iFrameRef}
                    src="/frameSource.html"
                    title={iFrameTitle}
                    sandbox="allow-scripts"
                    srcDoc={iFramePayload}></iframe>
            </div>
            <pre>{bundledCode}</pre>
        </div>
    );
};
