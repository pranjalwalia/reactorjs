import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import { cacheProvider } from '../services/cache/index';

/**
 *  Initialize Caching layer when when build engine starts bundling
 */
const { cacheService } = cacheProvider;
cacheService.initialize();

/**
 * esbuild Module Path Import Bypass Plugin
 * Description:
 *      Intercept import paths so esbuild doesn't attempt to map them to a file system location.
 *
 * @param {String} payload: Input Code obtained from state of {App.js} (Input Cell)
 * @interface: return type for esbuild bypass plugin
 * **/
export interface IPathPlugin {
    name: string;
    setup(builder: esbuild.PluginBuild): void;
}

export const unpkgBypassPathPlugin = (payload: string): IPathPlugin => {
    return {
        name: 'unpkg-bypass-path-plugin',

        /**
         * @param {builder: esbuild.PluginBuild}
         * **/
        setup(builder: esbuild.PluginBuild) {
            /**
             * Root Entry Resolver
             * Filter: regex ("args.path === index.js")
             *
             * *Callback*:
             * *Description* - executed on module resolution
             * @param {Object} args buildEngine args
             * @param {String} args.path unkpkg url to fetch module from
             * @param {Object} args.namespace namespace context from buildEngine
             * **/
            builder.onResolve(
                { filter: /(^index\.js$)/ },
                async (args: any): Promise<any> => {
                    return { path: args.path, namespace: 'a' };
                }
            );

            /**
             * Relative Import Resolver
             * Filter: regex (args.path.includes('./') || args.path.includes('../'))
             *
             * *Callback*:
             * *Description* - executed on module resolution
             * @param {Object} args buildEngine args
             * @param {String} args.path unkpkg url to fetch module from
             * @param {Object} args.namespace namespace context from buildEngine
             * **/
            builder.onResolve(
                { filter: /^\.+\// },
                async (args: any): Promise<any> => {
                    /**
                     * Todo: Dedicated Path Resolution Algorithm Call
                     **/
                    //* handles relative imports
                    return {
                        namespace: 'a',
                        path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href
                    };
                }
            );

            /**
             * Main Module Import Resolver
             * Filter: regex ('./')
             *
             * *Callback*:
             * *Description* - executed on module resolution
             * @param {Object} args buildEngine args
             * @param {String} args.path unkpkg url to fetch module from
             * @param {Object} args.namespace namespace context from buildEngine
             * **/
            builder.onResolve(
                { filter: /.*/ },
                async (args: any): Promise<any> => {
                    return {
                        path: `https://unpkg.com/${args.path}`,
                        namespace: 'a'
                    };
                }
            );

            /**
             * @param {Object} args buildEngine args
             * @param {String} args.path unkpkg url to fetch module from
             * @param {Object} args.namespace namespace context from buildEngine
             */
            builder.onLoad({ filter: /.*/ }, async (args: any) => {
                console.log('onLoad', args);

                if (args.path === 'index.js') {
                    return {
                        loader: 'jsx',
                        contents: payload
                    };
                }

                /**
                 * Program Flow:
                 *
                 * if module is cached:
                 *      return cachedResult
                 * else:
                 *      res = request_unpkg()
                 *      cache(res)
                 *      return res
                 * **/
                const cachedModule = await cacheService.getModule(args.path);
                if (cachedModule) {
                    console.log('module cached');
                    return cachedModule;
                }

                let { data, request } = await axios.get(args.path);

                const fetchedModule: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    contents: data,
                    resolveDir: new URL('./', request.responseURL).pathname
                };
                await cacheService.cacheModule(args.path, fetchedModule);

                return fetchedModule;
            });
        }
    };
};
