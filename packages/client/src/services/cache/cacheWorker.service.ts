import localforage from 'localforage';
import { BuildResult, OnLoadResult } from 'esbuild-wasm';
import { cacheDbConfig } from '../../config/cacheServiceConfig';
export class CacheService {
    _fileCache: LocalForage | any;

    constructor() {
        this.initialize();
    }

    initialize = (): void => {
        this._fileCache = localforage.createInstance(cacheDbConfig);
        console.log(this._fileCache);
    };

    getModule = async (key: string): Promise<null | BuildResult> => {
        const cachedResult = await this._fileCache.getItem(key);
        if (cachedResult) {
            return cachedResult;
        }
        return null;
    };

    cacheModule = async (key: string, value: OnLoadResult): Promise<void> => {
        await this._fileCache.setItem(key, value);
    };
}
