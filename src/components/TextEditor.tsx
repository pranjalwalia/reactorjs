import '../styles/TextEditor.css';
import MDEditor from '@uiw/react-md-editor';
import { useRef, useState, useEffect } from 'react';

const TextEditor: React.FC<{}> = ({}) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [editing, setEditing] = useState<boolean>(false);
    const [value, setValue] = useState<string>('# Header');

    useEffect(() => {
        const listener = (event: MouseEvent) => {
            if (ref.current && event.target && ref.current.contains(event.target as Node)) return;

            setEditing(false);
        };

        document.addEventListener('click', listener, { capture: true });

        return () => {
            document.removeEventListener('click', listener, { capture: true });
        };
    }, []);

    if (editing) {
        return (
            <div className="text-editor" ref={ref}>
                <MDEditor value={value} onChange={(v) => setValue(v || '')} />
            </div>
        );
    }

    return (
        <div className="text-editor card" onClick={() => setEditing(true)}>
            <div className="card-content">
                <MDEditor.Markdown source={'# Click to edit'} />
            </div>
        </div>
    );
};

export default TextEditor;
