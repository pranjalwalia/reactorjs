import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
    id: string;
    content: string;
    type: 'text' | 'code';
}

export const createCellsRouter = (filename: string, dir: string) => {
    const router = express.Router();
    router.use(express.json()); //parse json data

    const fullPath = path.join(dir, filename);
    console.log('[INFO] Looking for file: ', fullPath);

    router.get('/cells', async (_, res) => {
        try {
            const result = await fs.readFile(fullPath, { encoding: 'utf-8' });
            console.log('[INFO] Read file: ', result);
            res.send(JSON.parse(result));
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                //file does not exist, create it and add default cells
                await fs.writeFile(fullPath, '[]', 'utf-8');
                res.send([]);
            } else {
                throw error;
            }
        }
    });

    router.post('/cells', async (req, res) => {
        const { cells }: { cells: Cell[] } = req.body;
        await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');
        res.send({ status: 'ok' });
    });

    return router;
};
