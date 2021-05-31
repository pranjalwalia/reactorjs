import MonacoEditor from '@monaco-editor/react';

const Editor = () => {
    return (
        <MonacoEditor
            height="400px"
            language="javascript"
            theme="vs-dark"
            options={{
                wordWrap: 'on'
            }}
        />
    );
};

export default Editor;
