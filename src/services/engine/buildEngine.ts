import * as esbuild from 'esbuild-wasm';
import { engineConfig } from '../../config/buildEngineConfig';

export const engine = esbuild;

export const startService = async (): Promise<void> => {
    await esbuild.initialize(engineConfig);
};

export const transpile = async (
    input: string,
    options?: esbuild.TransformOptions | undefined
): Promise<esbuild.TransformResult> => {
    try {
        const buildResult = await esbuild.transform(input, options);
        return buildResult;
    } catch (err) {
        return err.message;
    }
};
