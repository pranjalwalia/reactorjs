import React, { ReactElement, useState, useEffect, useRef } from 'react';

import { initializeService, transpile, buildSystem } from '../services/engine/buildEngine';
import { unpkgBypassPathPlugin } from '../plugins/unkpg-bypass-path-plugin';
import { unpkgBypassFetchPlugin } from '../plugins/unpkg-bypass-fetch-plugin';

import { iFrameIdentifier } from '../utils/sandboxNameGenerator';

import Editor from '../containers/CodeEditor';

export const App: React.FC<{}> = (): ReactElement | null => {
    const [inputCode, setInputCode] = useState<string>('');
    const [transpiledCode, setTranspiledCode] = useState<string>('');
    const [bundledCode, setBundledCode] = useState<string | null>('');
    const inputCodeRef = useRef<any>();
    const iFrameRef = useRef<any>();

    useEffect((): void => {
        initializeService();
        inputCodeRef.current.focus();
    }, []);

    const bundlerInitialize = async (): Promise<void> => {
        if (!inputCodeRef.current.value || !inputCodeRef.current) {
            return;
        }
        try {
            const { code } = await transpile(inputCode, {
                loader: 'jsx',
                target: 'es2015'
            });
            console.log('Successfully Transpiled cell');
            setTranspiledCode(code);
        } catch (err) {
            console.log(`Transpilation failed with error: ${err.message}`);
            return;
        }

        try {
            const { outputFiles } = await buildSystem({
                entryPoints: ['index.js'],
                bundle: true,
                write: false,
                plugins: [unpkgBypassPathPlugin(), unpkgBypassFetchPlugin(inputCode)],
                define: {
                    global: 'window',
                    'process.env.NODE_ENV': '"production"'
                }
            });
            setBundledCode(outputFiles !== null ? outputFiles![0].text : null);
            iFrameRef.current.contentWindow.postMessage(outputFiles![0].text, '*');
        } catch (err) {
            // outputFiles is undefined
            console.log(err.message);
        }
    };

    const iFramePayload: string = `
    <html>
        <head></head>
        <body>
            <div id="root">
                <script>
                    window.addEventListener('message', (event) => {
                        eval(event.data);
                    }, false)
                </script>
            </div>
        </body>
    </html>`;
    const iFrameTitle: string = `iframe-${iFrameIdentifier(iFramePayload.length % 123)}`;

    return (
        <div>
            <div>
                <Editor />
            </div>
            <textarea
                ref={inputCodeRef}
                value={inputCode}
                onChange={(e) => {
                    setInputCode(e.target.value);
                }}></textarea>
            <div>
                <button onClick={bundlerInitialize}>Submit</button>
            </div>
            {/* <pre>{bundledCode}</pre> */}
            <div>
                <iframe
                    ref={iFrameRef}
                    src="/frameSource.html"
                    title={iFrameTitle}
                    sandbox="allow-scripts"
                    srcDoc={iFramePayload}></iframe>
            </div>
        </div>
    );
};
