import React, { ReactElement, useState, useEffect, useRef } from 'react';

import { initializeService, transpile, buildSystem } from '../services/engine/buildEngine';
import { unpkgBypassPathPlugin } from '../plugins/unkpg-bypass-path-plugin';
import { unpkgBypassFetchPlugin } from '../plugins/unpkg-bypass-fetch-plugin';

import { iFrameIdentifier } from '../utils/sandboxNameGenerator';

export const App: React.FC<{}> = (): ReactElement | null => {
    const [inputCode, setInputCode] = useState<string>('');
    const [bundledCode, setBundledCode] = useState<string | null>('');
    const ref = useRef<any>();

    useEffect((): void => {
        initializeService();
        ref.current = true;
    }, []);

    const bundlerInitialize = (e: React.MouseEvent<HTMLElement>): void => {
        if (!ref.current) {
            return;
        }

        transpile(inputCode, { loader: 'jsx', target: 'es2015' })
            .then(({ code }) => {
                console.log('Successfully Transpiled cell');
                setBundledCode(code);
            })
            .catch((err) => {
                console.log(`Transpilation failed with error: ${err.message}`);
                return;
            });

        buildSystem({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [unpkgBypassPathPlugin(), unpkgBypassFetchPlugin(inputCode)],
            define: {
                global: 'window',
                'process.env.NODE_ENV': '"production"'
            }
        })
            // bundled output
            .then(({ outputFiles }) =>
                setBundledCode(outputFiles !== null ? outputFiles![0].text : null)
            )
            // outputFiles is undefined
            .catch((err) => setBundledCode(err.message));
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
