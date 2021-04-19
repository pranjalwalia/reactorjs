import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import { cacheProvider } from '../services/cache/index';

const { cacheService } = cacheProvider;

/**
 *  - initialize cache service layer here
 */
cacheService.initialize();

export const unpkgBypassPathPlugin = (
    payload: string
): {
    name: string;
    setup(builder: esbuild.PluginBuild): void;
} => {
    return {
        name: 'unpkg-bypass-path-plugin',
        setup(builder: esbuild.PluginBuild) {
            builder.onResolve(
                { filter: /.*/ },
                async (args: any): Promise<any> => {
                    console.log('onResolve', args);
                    if (args.path === 'index.js') {
                        return { path: args.path, namespace: 'a' };
                    }

                    /**
                     * Todo: Dedicated Path Resolution Algorithm Call
                     **/
                    //* handles relative imports
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
                }
            );

            /**
             *
             * @param {Object} args buildEngine args
             * @param {String} args.path unkpkg url to fetch module from
             * @param {Object} args.namespace namespace context from buildEngine
             *
             */
            builder.onLoad({ filter: /.*/ }, async (args: any) => {
                console.log('onLoad', args);

                if (args.path === 'index.js') {
                    return {
                        loader: 'jsx',
                        contents: payload
                    };
                }

                //* if cached => return file,
                const cachedModule = await cacheService.getModule(args.path);
                if (cachedModule) {
                    console.log('module cached');
                    return cachedModule;
                }

                //* else {request upkg, cache response and return responses }
                let { data, request } = await axios.get(args.path);

                const fetchedModule: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    contents: data,
                    resolveDir: new URL('./', request.responseURL).pathname
                };

                //* cache module and return unpkg response
                await cacheService.cacheModule(args.path, fetchedModule);
                return fetchedModule;
            });
        }
    };
};
