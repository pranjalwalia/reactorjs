import '../styles/TextEditor.css';
import MDEditor from '@uiw/react-md-editor';
import { useRef, useState, useEffect } from 'react';
import { useActions } from '../hooks/useActions';
import { Cell } from '../state';

export interface TextEditorProps {
    cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [editing, setEditing] = useState<boolean>(false);
    const [value, setValue] = useState<string>('# Header');
    const { updateCellAction } = useActions();

    useEffect(() => {
        const listener = (event: MouseEvent) => {
            if (
                ref.current &&
                event.target &&
                ref.current.contains(event.target as Node)
            )
                return;

            setEditing(false);
        };

        document.addEventListener('click', listener, { capture: true });

        return () => {
            document.removeEventListener('click', listener, {
                capture: true
            });
        };
    }, []);

    if (editing) {
        return (
            <div className="text-editor" ref={ref}>
                <MDEditor
                    value={cell.content}
                    onChange={(value) =>
                        updateCellAction(cell.id, value ?? '')
                    }
                />
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
