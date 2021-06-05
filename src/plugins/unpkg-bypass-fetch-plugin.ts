import * as esbuild from 'esbuild-wasm'
import axios from 'axios'
import { cacheProvider } from '../services/cache'
import { IEnginePlugin } from '../interfaces/IEnginePlugin'

/**
 *  Initialize Cache Service layer when esbuild.Build()
 */
const { cacheService } = cacheProvider
cacheService.initialize()

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

      /**
       * @description Root Entry (first resolve) Resolver
       * - first load in execution context
       * - filter applied on args.path, here checks for `args.path === 'index.js'`
       * */
      builder.onLoad({ filter: /(^index\.js$)/ }, async (_args: any) => {
        return {
          loader: 'jsx',
          contents: payload,
        }
      })

      /**
       * @description module exists cache query called here
       *  - `null` return of `builder.onLoad` just executes the code
       *  - esbuild will match other `onLoad`'s till anyone returns something
       *  - any subsequent calls to `onLoad`  will request and cache the result, as cache lookup fails in this `onLoad`
       * @returns `null`
       */
      builder.onLoad({ filter: /.*/ }, async (args: any) => {
        const cachedModule = await cacheService.getModule(args.path)
        if (cachedModule) {
          console.log('module cached')
          // console.log(cachedModule);
          return cachedModule
        }
      })

      /**
       * @description Module Entry Resolver
       * - filter applied on args.path, here checks for `args.path` ends with extension `.css`
       * */
      builder.onLoad({ filter: /.css$/ }, async (args: any) => {
        //* fetch the resolved module and it's extension

        const { data, request } = await axios.get(args.path)

        /**
         * @description Placeholder is '${data}'
         * - the data may interfere with '' and cause early string termination
         * - replace with escaped data sequence
         */
        const escapedModuleContents = data
          .replace(/\n/g, '') //* concat all lines of code (minified by replacing '\n')
          .replace(/"/g, '\\"') //* transform double quote to escaped double quote
          .replace(/'/g, "\\'") //* transform single quote to escaped single quote

        const moduleContents = `
                    var style = document.createElement('style');
                    style.innerText = '${escapedModuleContents}';
                    document.head.appendChild(style)
                `

        /**
         * @description set loader to `jsx` always
         * - css loader outputs into seperate css file,
         * - not refrenced during in-browser bundling
         * - fix for css: Append all css inside a style tag
         * */
        const fetchedModule: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: moduleContents,
          resolveDir: new URL('./', request.responseURL).pathname,
        }

        await cacheService.cacheModule(args.path, fetchedModule)
        return fetchedModule
      })

      /**
       * @description Module Entry Resolver
       * - filter applied on args.path, here checks for `args.path` for others apart from `css`
       * */
      builder.onLoad({ filter: /.*/ }, async (args: any) => {
        //* fetch the resolved module and it's extension
        const { data, request } = await axios.get(args.path)
        const fetchedModule: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        }

        await cacheService.cacheModule(args.path, fetchedModule)
        return fetchedModule
      })
    },
  }
}
