import * as esbuild from 'esbuild-wasm';
import { cacheProvider } from '../services/cache';
import { IEnginePlugin } from '../interfaces/IEnginePlugin';
/**
 *  Initialize Caching layer upon bundling
 */
const { cacheService } = cacheProvider;
cacheService.initialize();

/**
 * `esbuild Module Path Import Bypass Plugin`
 * Description: Intercept import paths so esbuild doesn't attempt to
 *   map them to a file system location.
 * @param {String} payload: Input Code from state of {App.js} (Input Cell)
 * @interface: return type for esbuild bypass plugin
 * **/

export const unpkgBypassPathPlugin = (): IEnginePlugin => {
    return {
        name: 'unpkg-bypass-path-plugin',

        /**
         * @param {builder: esbuild.PluginBuild}
         * **/
        setup(builder: esbuild.PluginBuild) {
            /**
             * Root Entry Resolver
             * @description
             *  - Executed on module resolution
             *  -
             * @param {object} args buildEngine args
             * @param {string} args.path unkpkg url to fetch module from
             * @param {string} args.namespace namespace context from buildEngine
             * @param {string} args.resolveDir attribute on `esbuild.OnLoadResult` (output after passing into a loader)
             *   describes the original dir where importer was found
             * **/
            builder.onResolve({ filter: /.*/ }, async (args: any): Promise<any> => {
                //* first resolve
                if (args.path === 'index.js') {
                    return { path: args.path, namespace: 'a' };
                }

                /**
                 * Todo: Dedicated Path Resolution Algorithm Call
                 **/
                //* handle resolution of relative imports
                if (args.path.includes('./') || args.path.includes('../')) {
                    return {
                        namespace: 'a',
                        path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href
                    };
                }

                return {
                    path: `https://unpkg.com/${args.path}`,
                    namespace: 'a'
                };
            });
        }
    };
};
