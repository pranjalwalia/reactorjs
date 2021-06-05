import * as esbuild from 'esbuild-wasm'
// import { cacheProvider } from '../services/cache';
import { IEnginePlugin } from '../interfaces/IEnginePlugin'
/**
 *  Initialize Caching layer upon bundling
 */
// const { cacheService } = cacheProvider;
// cacheService.initialize();

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
    setup: (builder: esbuild.PluginBuild) => {
      /**
       * @description
       *  - Executed on module resolution
       *  - `onResolve` callback executed on imports (args.path) that satisfy the filter
       *
       * @param {object} args buildEngine args
       * @param {string} args.path unkpkg url to fetch module from
       * @param {string} args.namespace namespace context from buildEngine
       * @param {string} args.resolveDir attribute on `esbuild.OnLoadResult` (output after passing into a loader)
       *   describes the original dir where importer was found
       * **/

      /**
       * @description Root Entry (first resolve) Resolver
       * - filter applied on args.path, here checks for `args.path === 'index.js'`
       * */
      builder.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: 'index.js', namespace: 'a' }
      })

      /**
       * @description Relative Import ('./', '../') Resolver
       * - filter applied on args.path,
       * - here checks for `args.path.includes('./') || args.path.includes('../')`
       *
       * Todo: Dedicated Path Resolution Algorithm Call
       **/
      builder.onResolve(
        { filter: /^\.+\// },
        async (args: any): Promise<any> => {
          return {
            namespace: 'a',
            path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`)
              .href,
          }
        }
      )

      /**
       * @description Handle Main module Import
       * - filter applied on args.path,
       **/
      builder.onResolve(
        { filter: /.*/ },
        async (args: any): Promise<any> => {
          return {
            path: `https://unpkg.com/${args.path}`,
            namespace: 'a',
          }
        }
      )
    },
  }
}
