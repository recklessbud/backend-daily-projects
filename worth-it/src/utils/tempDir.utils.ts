import { mkdir, rm } from 'fs/promises';
import path from 'path';
import os from 'os';

export const tempDirManager = {
    create: async (dirname: string): Promise<string> => {
        const tempDir = path.join(os.tmpdir(), dirname);
        await mkdir(tempDir, { recursive: true });
        return tempDir;
    },

    cleanup: async (dirname: string): Promise<void> => {
        const tempDir = path.join(os.tmpdir(), dirname);
        await rm(tempDir, { recursive: true, force: true });
    }
};