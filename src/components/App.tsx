import React, { ReactElement, useState } from 'react';

export const App: React.FC = (): ReactElement | null => {
    const [inputCode, setInputCode] = useState<string>('');
    const [bundledCode, setBundledCode] = useState<string>('');

    const startBundling = (e: React.MouseEvent<HTMLElement>) => {
        if (!bundledCode) {
            return;
        }
        const result = '';
        setBundledCode(result);
        console.log(bundledCode);
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
