import React, { ReactElement, useState, useEffect } from 'react';
import { startService } from '../services/engine/buildEngine';

export const App: React.FC = (): ReactElement | null => {
    const [inputCode, setInputCode] = useState<string>('');
    const [bundledCode, setBundledCode] = useState<string>('');

    useEffect((): void => {
        startService();
    }, []);

    const startBundling = (e: React.MouseEvent<HTMLElement>) => {
        console.log(inputCode);
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
