import 'bulmaswatch/superhero/bulmaswatch.min.css';
import { useState, useEffect } from 'react';
import { initializeService } from '../services/engine/buildEngine';
import { ExecutionCell } from '../containers/ExecutionCell';
import TextEditor from '../components/TextEditor';

export const App: React.FC<{}> = () => {
    const [buildEngineStatus, setBuildEngineStatus] = useState<boolean>(false);
    const [errors, setErrors] = useState<string>('');

    useEffect((): void => {
        try {
            initializeService();
            setBuildEngineStatus(true);
        } catch (err: any) {
            setErrors(err.message);
        }
    }, []);

    return (
        <div>
            <TextEditor />
            {/* {buildEngineStatus === true ? (
                <>
                    <div>
                        <ExecutionCell />
                    </div>
                </>
            ) : (
                <p>{JSON.stringify(errors)}</p>
            )} */}
        </div>
    );
};
