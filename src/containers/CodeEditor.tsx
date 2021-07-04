import MonacoEditor from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export interface IEditorProps {
    initialValue: string;
    executableCodeOnChangeHandler(value: string): void;
}

const Editor: React.FC<IEditorProps> = ({
    initialValue,
    executableCodeOnChangeHandler
}: IEditorProps) => {
    const editorOnChangeHandler = (
        value: string | undefined,
        ev: monaco.editor.IModelContentChangedEvent
    ) => {
        if (value) {
            executableCodeOnChangeHandler(value);
        }
    };

    return (
        <MonacoEditor
            value={initialValue}
            onChange={editorOnChangeHandler}
            height="400px"
            language="javascript"
            theme="vs-dark"
            options={{
                wordWrap: 'on',
                showUnused: false,
                folding: false,
                lineNumbersMinChars: 3,
                fontSize: 15,
                fontLigatures: true,
                scrollBeyondLastLine: false,
                automaticLayout: true
            }}
        />
    );
};

export default Editor;
