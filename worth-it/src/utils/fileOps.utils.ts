// import { data } from 'cheerio/dist/commonjs/api/attributes';
import { existsSync } from 'fs';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';

interface FileOperations {
    saveData: (data: any) => Promise<void>;
    readData: () => Promise<any>;
    init: () => Promise<void>;
}

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

export const fileOps: FileOperations = {
    init: async () => {
        try {
            await mkdir(DATA_DIR, { recursive: true });
            if(!existsSync(PRODUCTS_FILE)){
                await writeFile(PRODUCTS_FILE, JSON.stringify([], null, 2));
            }
        } catch (error) {
            console.error('Error initializing data file:', error);
            throw error;
        }
    },
    saveData: async (data: any) => {
        try {
            await fileOps.init();
            await writeFile(PRODUCTS_FILE, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error saving data:', error);
            throw error;
        }
    },

    readData: async () => {
        try {
            await fileOps.init();
            const data = await readFile(PRODUCTS_FILE, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            const errors = error as NodeJS.ErrnoException;
            if (errors.code === 'ENOENT') {
                return [];
            }
            console.error('Error reading data:', error);
            throw error;
        }
    }
};