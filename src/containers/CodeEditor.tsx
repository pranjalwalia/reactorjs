import MonacoEditor from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useRef } from 'react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';

export interface IEditorProps {
    initialValue: string;
    executableCodeOnChangeHandler(value: string): void;
}

const Editor: React.FC<IEditorProps> = ({
    initialValue,
    executableCodeOnChangeHandler
}: IEditorProps) => {
    const editorContentRef = useRef<any>();
    // const editorRef = useRef<any>();

    // const editorOnChangeHandler = (
    //     value: string | undefined,
    //     ev: monaco.editor.IModelContentChangedEvent
    // ) => {
    //     if (value) {
    //         editorContentRef.current = value;
    //         executableCodeOnChangeHandler(value);
    //     }
    // };

    const prettifyEditorContents = (e: any) => {
        console.log('clicked', e);
        // get current content
        const unformattedContent = editorContentRef.current;
        console.log(unformattedContent);

        // format it
        const formattedContent: string = prettier.format(unformattedContent, {
            parser: 'babel',
            plugins: [parser],
            useTabs: false,
            semi: true,
            singleQuote: true
        });
        console.log('format >> ', formattedContent);

        // set formatted output in the editor
        // editorContentRef.current = formattedContent;
        // executableCodeOnChangeHandler(formattedContent);
    };

    return (
        <div>
            <button onClick={prettifyEditorContents}>prettify</button>
            <MonacoEditor
                value={initialValue}
                // onChange={editorOnChangeHandler}
                // onMount={(editor, monaco) => {
                //     editorRef.current = editor;
                //     console.log(editorRef.current);
                // }}
                height="400px"
                language="javascript"
                theme="vs-dark"
                options={{
                    // tabSize: 2,
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
        </div>
    );
};

export default Editor;
