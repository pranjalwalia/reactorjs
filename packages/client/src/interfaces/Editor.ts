export interface IEditorProps {
    initialValue: string;
    executableCodeOnChangeHandler(value: string): void;
}
