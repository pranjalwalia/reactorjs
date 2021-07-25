import * as esbuild from 'esbuild-wasm';
import { engineConfig } from '../../config/buildEngineConfig';

export const engine = esbuild;

export const generateTranpiledCode = async (rawCode: string): Promise<string> => {
    const res = await transpile(rawCode, {
        loader: 'jsx',
        target: 'es2015'
    });
    return res.code;
};

export const generateBundledCode = async (rawCode: string) => {};

export const initializeService = async (): Promise<void> => {
    await esbuild.initialize(engineConfig);
};

export const transpile = async (
    input: string,
    options?: esbuild.TransformOptions | undefined
): Promise<esbuild.TransformResult> => {
    try {
        const transpilationResult = await esbuild.transform(input, options);
        return transpilationResult;
    } catch (err) {
        return err.message;
    }
};

export const buildSystem = async (options: esbuild.BuildOptions): Promise<esbuild.BuildResult> => {
    try {
        const buildResult = await esbuild.build(options);
        return buildResult;
    } catch (err) {
        return err.message;
    }
};
