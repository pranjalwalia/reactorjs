import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { startService, transpile } from '../services/engine/buildEngine';

export const App: React.FC = (): ReactElement | null => {
    const [inputCode, setInputCode] = useState<string>('');
    const [bundledCode, setBundledCode] = useState<string>('');
    const ref = useRef<any>();

    useEffect((): void => {
        startService();
        ref.current = true;
    }, []);

    const startBundling = (e: React.MouseEvent<HTMLElement>) => {
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
