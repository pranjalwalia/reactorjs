import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
// import { cacheProvider } from '../services/cache';

export const unpkgBypassPathPlugin = (): {
    name: string;
    setup(builder: esbuild.PluginBuild): void;
} => {
    return {
        name: 'unpkg-bypass-path-plugin',
        setup(builder: esbuild.PluginBuild) {
            /**
             *  - `setup` is only called "once" for every build operation
             *  - initialize cache service layer here
             */

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
                        contents: `
                        import React, {useEffect} from 'react-select';
                        import ReactDOM from 'react-dom';
                        console.log('pranjal')
                        `
                    };
                }

                let { data, request } = await axios.get(args.path);

                return {
                    loader: 'jsx',
                    contents: data,
                    resolveDir: new URL('./', request.responseURL).pathname
                };
            });
        }
    };
};
