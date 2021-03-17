import * as esbuild from 'esbuild-wasm';
import { engineConfig } from '../../config/buildEngineConfig';

export const startService = async (): Promise<void> => {
    await esbuild.initialize(engineConfig);
    console.log(esbuild);
};
