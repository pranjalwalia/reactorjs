/**
 * !component lifecycle
 *
 *  builder.onLoad(
 *      if(cached)
 *          load();
 *      else request_unpkg();
 * )
 *
 */

import localforage from 'localforage';
import { cacheDbConfig } from '../../constants/cacheServiceConfig';

export class CacheService {
    _fileCache: LocalForage | any;
    constructor() {
        this._fileCache = this._fileCache.bind(this);
    }
    initialize = (): void => {
        console.log('cache service init !!!');
        this._fileCache = localforage.createInstance(cacheDbConfig);
    };
}
