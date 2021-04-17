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
                async (
                    args: any
                ): Promise<{
                    path: any;
                    namespace: string;
                }> => {
                    console.log('onResolve', args);
                    if (args.path === 'index.js') {
                        return { path: args.path, namespace: 'a' };
                    } else if (args.path === 'tiny-test-pkg') {
                        return {
                            path: 'https://unkpg.com/tiny-test-pkg@1.0.0/index.js',
                            namespace: 'a'
                        };
                    }
                    return { path: args.path, namespace: 'a' };
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
              import message from 'tiny-test-pkg';
              console.log(message);
            `
                    };
                }
                const { data } = await axios.get(args.path, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                console.log(data);
            });
        }
    };
};
