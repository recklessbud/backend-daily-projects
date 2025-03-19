import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

export const fileOps = {
    saveData: async (data: any): Promise<void> => {
        try {
            // Ensure data directory exists
            await mkdir(DATA_DIR, { recursive: true });
            await writeFile(PRODUCTS_FILE, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error saving data:', error);
            throw error;
        }
    },

    readData: async (): Promise<any> => {
        try {
            // Ensure data directory exists
            await mkdir(DATA_DIR, { recursive: true });
            
            try {
                const data = await readFile(PRODUCTS_FILE, 'utf-8');
                return JSON.parse(data);
            } catch (error) {
                const errors = error as NodeJS.ErrnoException;
                // If file doesn't exist, return empty array
                if (errors.code === 'ENOENT') {
                    return [];
                }
                throw errors;
            }
        } catch (error) {
            console.error('Error reading data:', error);
            return [];
        }
    }
};