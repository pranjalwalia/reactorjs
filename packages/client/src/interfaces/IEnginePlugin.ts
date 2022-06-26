import { PluginBuild } from 'esbuild-wasm';

export interface IEnginePlugin {
    name: string;
    setup(builder: PluginBuild): void;
}
