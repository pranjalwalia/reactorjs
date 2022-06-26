import * as esbuild from 'esbuild-wasm';
import { engineConfig } from '../../config/buildEngineConfig';
import { unpkgBypassPathPlugin } from '../../plugins/unkpg-bypass-path-plugin';
import { unpkgBypassFetchPlugin } from '../../plugins/unpkg-bypass-fetch-plugin';

// export let engine = esbuild;
export const BUNDLER_UNDEFINED_ERROR =
    'Something went wrong while generating bundled code';

export interface IBundlerResponse {
    code: string;
    error: string;
}

// export const engineGenerateTranpiledCode = async (
//     rawCode: string
// ): Promise<string> => {
//     const res = await transpile(rawCode, {
//         loader: 'jsx',
//         target: 'es2015'
//     });
//     return res.code;
// };

// export const engineGenerateBundledCode = async (
//     rawCode: string
// ): Promise<IBundlerResponse> => {
//     try {
//         const res = await buildSystem({
//             entryPoints: ['index.js'],
//             bundle: true,
//             write: false,
//             plugins: [
//                 unpkgBypassPathPlugin(),
//                 unpkgBypassFetchPlugin(rawCode)
//             ],
//             define: {
//                 global: 'window',
//                 'process.env.NODE_ENV': '"production"'
//             }
//         });
//         return res.outputFiles
//             ? { code: res.outputFiles[0].text, error: '' }
//             : { code: '', error: BUNDLER_UNDEFINED_ERROR };
//     } catch (err: any) {
//         console.log(err.message);
//         return {
//             code: '',
//             error: err?.message ? err?.message : BUNDLER_UNDEFINED_ERROR
//         };
//     }
// };

// export const initializeService = async (): Promise<void> => {
//     console.log('starting wasm engine');
//     await esbuild.initialize(engineConfig);
// };

// export const transpile = async (
//     input: string,
//     options?: esbuild.TransformOptions | undefined
// ): Promise<esbuild.TransformResult> => {
//     try {
//         const transpilationResult = await esbuild.transform(
//             input,
//             options
//         );
//         return transpilationResult;
//     } catch (err: any) {
//         return err.message;
//     }
// };

// export const buildSystem = async (
//     options: esbuild.BuildOptions
// ): Promise<esbuild.BuildResult> => {
//     try {
//         const buildResult = await esbuild.build(options);
//         return buildResult;
//     } catch (err: any) {
//         return err.message;
//     }
// };

//! todo: refactor into static methods of a service
let service: esbuild.Service;
const BaseBundler = async (rawCode: string) => {
    if (!service) {
        service = await esbuild.startService(engineConfig);
    }
    try {
        const result = await service.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [
                unpkgBypassPathPlugin(),
                unpkgBypassFetchPlugin(rawCode)
            ],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window'
            },
            jsxFactory: '_React.createElement',
            jsxFragment: '_React.Fragment'
        });
        return result.outputFiles
            ? { code: result.outputFiles[0].text, error: '' }
            : { code: '', error: BUNDLER_UNDEFINED_ERROR };
    } catch (err: any) {
        console.log(err.message);
        return {
            code: '',
            error: err?.message ? err?.message : BUNDLER_UNDEFINED_ERROR
        };
    }
};

export default BaseBundler;
