import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import { cacheProvider } from '../services/cache/index';
import { IEnginePlugin } from '../interfaces/IEnginePlugin';

/**
 *  Initialize Cache Service layer when esbuild.Build()
 */
const { cacheService } = cacheProvider;
cacheService.initialize();

/**
 *  @title esbuild Module Path Load Bypass Plugin
 * @description:
 *      Intercept resolved modules so esbuild doesn't attempt to map them to the fs.
 *
 * @param {String} payload: Input Code from state of {App.js} (Input Cell)
 * @interface: return type for esbuild bypass plugin
 * **/
export const unpkgBypassFetchPlugin = (payload: string): IEnginePlugin => {
    return {
        name: 'unpkg-bypass-fetch-plugin',

        /**
         * @param {builder: esbuild.PluginBuild}
         * **/
        setup: (builder: esbuild.PluginBuild) => {
            /**
             * @param {Object} args buildEngine args
             * @param {String} args.path unkpkg url to fetch module from
             * @param {Object} args.namespace namespace context from buildEngine
             */
            builder.onLoad({ filter: /.*/ }, async (args: any) => {
                //* first load in execution context
                if (args.path === 'index.js') {
                    return {
                        loader: 'jsx',
                        contents: payload
                    };
                }

                /**
                 * @description
                 *      if module is cached, return it
                 *      else request, cache and return
                 * **/
                const cachedModule = await cacheService.getModule(args.path);
                if (cachedModule) {
                    console.log('module cached');
                    // console.log(cachedModule);
                    return cachedModule;
                }

                //* fetch the resolved module and it's extension
                let { data, request } = await axios.get(args.path);
                const moduleExtension = args.path.match(/.css$/) ? 'css' : 'jsx';

                /**
                 * @description Placeholder is '${data}'
                 * - the data may interfere with '' and cause early string termination
                 * - replace with escaped data sequence
                 */
                const escapedModuleContents = data
                    .replace(/\n/g, '') //* concat all lines of code (minified by replacing '\n')
                    .replace(/"/g, '\\"') //* transform double quote to escaped double quote
                    .replace(/'/g, "\\'"); //* transform single quote to escaped single quote

                const moduleContents =
                    moduleExtension === 'css'
                        ? `
                    var style = document.createElement('style');
                    style.innerText = '${escapedModuleContents}';
                    document.head.appendChild(style)
                `
                        : data;

                /**
                 * @description set loader to `jsx` always
                 * - css loader outputs into seperate css file,
                 * - not refrenced during in-browser bundling
                 * - fix for css: Append all css inside a style tag
                 * */
                const fetchedModule: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    contents: moduleContents,
                    resolveDir: new URL('./', request.responseURL).pathname
                };
                await cacheService.cacheModule(args.path, fetchedModule);

                return fetchedModule;
            });
        }
    };
};
