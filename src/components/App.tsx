import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { initializeService, transpile, buildSystem } from '../services/engine/buildEngine';
import { unpkgBypassPathPlugin } from '../plugins/unkpg-bypass-path-plugin';

export const App: React.FC<{}> = (): ReactElement | null => {
    const [inputCode, setInputCode] = useState<string>('');
    const [bundledCode, setBundledCode] = useState<string | null>('');
    const ref = useRef<any>();

    useEffect((): void => {
        initializeService();
        ref.current = true;
    }, []);

    const startBundling = (e: React.MouseEvent<HTMLElement>): void => {
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
            plugins: [unpkgBypassPathPlugin(inputCode)],
            define: {
                global: 'window',
                'process.env.NODE_ENV': '"production"'
            }
        })
            // bundled output
            .then(({ outputFiles }) => setBundledCode(outputFiles![0].text))
            // outputFiles is undefined
            .catch((err) => setBundledCode(err.message));
    };

    return (
        <div>
            <textarea value={inputCode} onChange={(e) => setInputCode(e.target.value)}></textarea>
            <div>
                <button onClick={startBundling}>Submit</button>
            </div>
            <pre>{bundledCode}</pre>
        </div>
    );
};
