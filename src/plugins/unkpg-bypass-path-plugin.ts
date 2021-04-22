import * as esbuild from 'esbuild-wasm';

/**
 *  @title esbuild Module Path Resolve Bypass Plugin
 * @description:
 *      Intercept import paths so esbuild doesn't attempt to map them to a file system location.
 *
 * @param {String} payload: Input Code from state of {App.js} (Input Cell)
 * @interface: return type for esbuild bypass plugin
 * **/
export interface IPathPlugin {
    name: string;
    setup(builder: esbuild.PluginBuild): void;
}

export const unpkgBypassPathPlugin = (): IPathPlugin => {
    return {
        name: 'unpkg-bypass-path-plugin',

        /**
         * @param {builder: esbuild.PluginBuild}
         * **/
        setup(builder: esbuild.PluginBuild) {
            /**
             * Root Entry Resolver
             *
             * @callback
             * @description  executed on module resolution
             * @param {Object} args buildEngine args
             * @param {String} args.path unkpkg url to fetch module from
             * @param {Object} args.namespace namespace context from buildEngine
             * **/
            builder.onResolve(
                { filter: /.*/ },
                async (args: any): Promise<any> => {
                    //* first resolve
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
        }
    };
};
