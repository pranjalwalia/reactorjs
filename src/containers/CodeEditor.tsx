import Editor, { Monaco } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import { useRef } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { IEditorProps } from '../interfaces/Editor';

const CodeEditor: React.FC<IEditorProps> = ({
    initialValue,
    executableCodeOnChangeHandler
}: IEditorProps) => {
    const monacoRef = useRef<any>(null);

    const handleEditorWillMount = (monaco: any): void => {
        monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    };

    const handleEditorChange = (
        value: string | undefined,
        event: monaco.editor.IModelContentChangedEvent
    ): void => {
        if (value) {
            executableCodeOnChangeHandler(value);
        }
    };

    const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
        monacoRef.current = editor;
        monacoRef.current.updateOptions({ tabSize: 2 });
    };

    const prettiyPrintEditorContents = async (): Promise<void> => {
        const rawCode = monacoRef.current.getModel().getValue();

        const formatted = await prettier
            .format(rawCode, {
                parser: 'babel',
                plugins: [parser],
                useTabs: false,
                semi: true,
                singleQuote: true,
                trailingComma: 'none',
                jsxBracketSameLine: true
            })
            .replace(/\n$/, '');

        monacoRef.current.setValue(formatted);
    };

    return (
        <div>
            <button onClick={prettiyPrintEditorContents}>prettify</button>
            <Editor
                height="90vh"
                defaultLanguage="javascript"
                defaultValue={initialValue}
                beforeMount={handleEditorWillMount}
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
            />
        </div>
    );
};

export default CodeEditor;
