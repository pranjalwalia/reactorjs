import React, { ReactElement, useState, useEffect, useRef } from 'react';

import { initializeService, transpile, buildSystem } from '../services/engine/buildEngine';
import { unpkgBypassPathPlugin } from '../plugins/unkpg-bypass-path-plugin';
import { unpkgBypassFetchPlugin } from '../plugins/unpkg-bypass-fetch-plugin';

import { iFrameIdentifier } from '../utils/sandboxNameGenerator';

export const App: React.FC<{}> = (): ReactElement | null => {
    const [inputCode, setInputCode] = useState<string>('');
    const [transpiledCode, setTranspiledCode] = useState<string>('');
    const [bundledCode, setBundledCode] = useState<string | null>('');
    const ref = useRef<any>();
    // const frameRef = useRef<any>();

    useEffect((): void => {
        initializeService();
        ref.current = true;
    }, []);

    const bundlerInitialize = async (e: React.MouseEvent<HTMLElement>): Promise<void> => {
        if (!ref.current) {
            return;
        }

        try {
            const { code, warnings } = await transpile(inputCode, {
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
            const { outputFiles, warnings } = await buildSystem({
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
        } catch (err) {
            // outputFiles is undefined
            setBundledCode(err.message);
        }
    };

    const iFramePayload: string = `<script> ${bundledCode} </script>`;
    const iFrameTitle: string = `iframe-${iFrameIdentifier(iFramePayload.length % 123)}`;

    return (
        <div>
            <textarea value={inputCode} onChange={(e) => setInputCode(e.target.value)}></textarea>
            <div>
                <button onClick={bundlerInitialize}>Submit</button>
            </div>
            <pre>{bundledCode}</pre>
            <iframe
                src="/test.html"
                title={iFrameTitle}
                sandbox="allow-scripts"
                srcDoc={iFramePayload}></iframe>
        </div>
    );
};
