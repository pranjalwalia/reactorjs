import express from 'express';
import path from 'path';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createCellsRouter } from './routes/cells';

export const serve = (
    port: number,
    filename: string,
    dir: string,
    useProxy: boolean
) => {
    const app = express();
    app.use(cors());
    app.use(createCellsRouter(filename, dir));

    if (useProxy) {
        console.log(
            '[INFO]: using proxy to serve regular build, NODE_ENV:',
            process.env.NODE_ENV
        );
        app.use(
            createProxyMiddleware({
                target: 'http://localhost:3000',
                ws: true,
                logLevel: 'info'
            })
        );
    } else {
        console.log('[INFO]: using static files, serving production build');
        const packagePath = require.resolve('@reactor/client/build/index.html');
        app.use(express.static(path.dirname(packagePath)));
    }

    return new Promise<void>((resolve, reject) => {
        app.listen(port, resolve).on('error', reject);
    });
};
