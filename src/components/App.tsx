import 'bulmaswatch/superhero/bulmaswatch.min.css';
import { ExecutionCell } from '../containers/ExecutionCell';
import { useState, useEffect } from 'react';
import { initializeService } from '../services/engine/buildEngine';

export const App: React.FC<{}> = () => {
    const [buildEngineStatus, setBuildEngineStatus] = useState<boolean>(false);
    const [errors, setErrors] = useState<string>('');

    useEffect((): void => {
        try {
            initializeService();
            setBuildEngineStatus(true);
        } catch (err) {
            setErrors(err.message);
        }
    }, []);

    return (
        <div>
            {buildEngineStatus === true ? (
                <>
                    <ExecutionCell />
                </>
            ) : (
                <p>{JSON.stringify(errors)}</p>
            )}
        </div>
    );
};
