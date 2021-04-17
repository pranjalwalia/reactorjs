import * as esbuild from 'esbuild-wasm';
import axios from 'axios';

export const unpkgBypassPathPlugin = (): {
    name: string;
    setup(build: esbuild.PluginBuild): void;
} => {
    return {
        name: 'unpkg-bypass-path-plugin',
        setup(build: esbuild.PluginBuild) {
            build.onResolve(
                { filter: /.*/ },
                async (args: any): Promise<any> => {
                    console.log('onResolve', args);
                    if (args.path === 'index.js') {
                        return { path: args.path, namespace: 'a' };
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
            build.onLoad({ filter: /.*/ }, async (args: any) => {
                console.log('onLoad', args);

                if (args.path === 'index.js') {
                    return {
                        loader: 'jsx',
                        contents: `
                        const message = require('tiny-test-pkg');
                        console.log(message);            `
                    };
                }

                let response;
                try {
                    let { data } = await axios.get(args.path);
                    response = data;
                } catch (err) {
                    response = null;
                }
                return {
                    loader: 'jsx',
                    contents: response
                };
            });
        }
    };
};
