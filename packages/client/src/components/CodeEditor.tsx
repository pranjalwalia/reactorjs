import '../styles/CodeEditor.css';
import '../styles/Syntax.css';

import React, { useRef } from 'react';
import MonocoEditor, { EditorDidMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import codeShift from 'jscodeshift';
import Highlighter from 'monaco-jsx-highlighter';

interface CodeEditorProps {
    initialValue: string;
    onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
    const editorRef = useRef<any>();

    const onEditorDidMount: EditorDidMount = (getEditorValue, monacoEditor) => {
        editorRef.current = monacoEditor;

        monacoEditor.onDidChangeModelContent(() => {
            onChange(getEditorValue());
        });

        monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

        const highlighter = new Highlighter(
            //@ts-ignore
            window.monaco,
            codeShift,
            monacoEditor
        );

        highlighter.highLightOnDidChangeModelContent(
            () => {},
            () => {},
            undefined,
            () => {}
        );
    };

    const prettiyPrintEditorContent = async (): Promise<void> => {
        const unformatted = editorRef.current.getModel().getValue();
        const formatted = await prettier
            .format(unformatted, {
                parser: 'babel',
                plugins: [parser],
                useTabs: false,
                semi: true,
                singleQuote: true,
                trailingComma: 'none',
                jsxBracketSameLine: true
            })
            .replace(/\n$/, '');
        editorRef.current.setValue(formatted);
    };

    return (
        <div className="editor-wrapper">
            <button
                className="button button-format is-primary is-small"
                onClick={prettiyPrintEditorContent}>
                prettify
            </button>
            <MonocoEditor
                value={initialValue}
                editorDidMount={onEditorDidMount}
                height="100%"
                theme="vs-dark"
                language="javascript"
                options={{
                    wordWrap: 'on',
                    minimap: { enabled: true },
                    showUnused: false,
                    folding: false,
                    lineNumbersMinChars: 3,
                    fontSize: 16,
                    scrollBeyondLastLine: false,
                    automaticLayout: true
                }}
            />
        </div>
    );
};

export default CodeEditor;
