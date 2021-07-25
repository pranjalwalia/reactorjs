import './styles/CodeEditor.css';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import Editor from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';

import { useState, useRef } from 'react';
import { IEditorProps } from '../interfaces/Editor';

import MonacoJSXHighlighter from 'monaco-jsx-highlighter';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

let monacoJSXHighlighter: any = null,
    activateJSXHighlighting: any = null,
    disposeJSXHighlighting: any = null,
    activateJSXCommenting: any = null,
    disposeJSXCommenting: any = null;

const CodeEditor: React.FC<IEditorProps> = ({
    initialValue,
    executableCodeOnChangeHandler
}: IEditorProps) => {
    const monacoRef = useRef<any>(null);

    const [isEditorReady, setIsEditorReady] = useState(false);
    const [isJSXHighlight, setIsJSXHighlight] = useState(false);
    const [isJSXComment, setIsJSXComment] = useState(false);

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

    const handleEditorDidMount = async (
        editor: monaco.editor.IStandaloneCodeEditor,
        monaco: unknown
    ) => {
        monacoRef.current = editor;
        monacoRef.current.updateOptions({ tabSize: 2 });

        const babelParse = (code: string) =>
            parse(code, { sourceType: 'module', plugins: ['jsx'] });

        monacoJSXHighlighter = new MonacoJSXHighlighter(monaco, babelParse, traverse, editor);
        disposeJSXHighlighting = monacoJSXHighlighter.highLightOnDidChangeModelContent(
            6000,
            () => {}
        );
        disposeJSXCommenting = monacoJSXHighlighter.addJSXCommentCommand();

        handleEditorDidMountBoilerPlate();
    };

    const handleEditorDidMountBoilerPlate = () => {
        activateJSXHighlighting = monacoJSXHighlighter.highLightOnDidChangeModelContent;
        activateJSXCommenting = monacoJSXHighlighter.addJSXCommentCommand;

        setIsEditorReady(true);
        setIsJSXHighlight(true);
        setIsJSXComment(true);
    };

    function toggleJSXHighLighting() {
        const newIsJSXHighlight = !isJSXHighlight;
        disposeJSXHighlighting && disposeJSXHighlighting();
        disposeJSXHighlighting = null;
        if (newIsJSXHighlight && activateJSXHighlighting) {
            disposeJSXHighlighting = activateJSXHighlighting();
            setIsJSXHighlight(true);
        } else {
            setIsJSXHighlight(false);
        }
    }

    function toggleJSXcommenting() {
        const newIsJSXComment = !isJSXComment;
        disposeJSXCommenting && disposeJSXCommenting();
        disposeJSXCommenting = null;
        if (newIsJSXComment && activateJSXCommenting) {
            disposeJSXCommenting = activateJSXCommenting();
            setIsJSXComment(true);
        } else {
            setIsJSXComment(false);
        }
    }

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
            <button
                style={{
                    margin: 2,
                    color: isJSXHighlight ? 'royalblue' : 'darkorange'
                }}
                onClick={toggleJSXHighLighting}
                disabled={!isEditorReady}>
                Toggle JSX highlighting
            </button>
            <button
                style={{
                    margin: 2,
                    color: isJSXComment ? 'royalblue' : 'darkorange'
                }}
                onClick={toggleJSXcommenting}
                disabled={!isEditorReady}>
                Toggle JSX Commenting
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
