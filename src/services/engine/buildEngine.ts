import * as esbuild from 'esbuild-wasm';
import { engineConfig } from '../../config/buildEngineConfig';
import { unpkgBypassPathPlugin } from '../../plugins/unkpg-bypass-path-plugin';
import { unpkgBypassFetchPlugin } from '../../plugins/unpkg-bypass-fetch-plugin';

export const engine = esbuild;

export const engineGenerateTranpiledCode = async (rawCode: string): Promise<string> => {
    const res = await transpile(rawCode, {
        loader: 'jsx',
        target: 'es2015'
    });
    return res.code;
};

export const engineGenerateBundledCode = async (rawCode: string): Promise<string | null> => {
    const res = await buildSystem({
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        plugins: [unpkgBypassPathPlugin(), unpkgBypassFetchPlugin(rawCode)],
        define: {
            global: 'window',
            'process.env.NODE_ENV': '"production"'
        }
    });
    if (res.outputFiles) {
        return res.outputFiles[0].text;
    }
    return null;
};

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

//! todo: refactor into static methods of a service
