import * as esbuild from 'esbuild-wasm';

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
                    return { path: args.path, namespace: 'a' };
                }
            );

            build.onLoad({ filter: /.*/ }, async (args: any) => {
                console.log('onLoad', args);

                if (args.path === 'index.js') {
                    return {
                        loader: 'jsx',
                        contents: `
              import message from './message';
              console.log(message);
            `
                    };
                } else {
                    return {
                        loader: 'jsx',
                        contents: 'export default "returned from plugin"'
                    };
                }
            });
        }
    };
};
