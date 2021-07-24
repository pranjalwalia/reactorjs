import './styles/CodeEditor.css';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import Editor from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';

import { useRef } from 'react';
import { IEditorProps } from '../interfaces/Editor';

import MonacoJSXHighlighter from 'monaco-jsx-highlighter';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

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

    const babelParse = (code: string) =>
        parse(code, {
            sourceType: 'module',
            plugins: ['jsx']
        });

    const handleEditorDidMount = async (
        editor: monaco.editor.IStandaloneCodeEditor,
        monaco: unknown
    ) => {
        monacoRef.current = editor;
        monacoRef.current.updateOptions({ tabSize: 2 });

        const monacoJSXHighlighter = new MonacoJSXHighlighter(monaco, babelParse, traverse, editor);
        monacoJSXHighlighter.highLightOnDidChangeModelContent();
        monacoJSXHighlighter.addJSXCommentCommand();
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
        <div className="editor-container">
            <button
                style={{ margin: 8, borderRadius: 5 }}
                className="button button-format is-primary is-small"
                onClick={prettiyPrintEditorContents}>
                prettify
            </button>
            <Editor
                height="90vh"
                theme="vs-dark"
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
