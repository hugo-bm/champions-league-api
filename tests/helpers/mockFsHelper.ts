import type { PathLike } from 'fs';
import { promises as fs } from 'node:fs';

/**
 * Describes the data structure for configuring latency in read and write operations.
 *
 * @property read: An array of times in milliseconds with two positions, ordered by
 * minimum and maximum value respectively.
 *
 * @property write: An array of times in milliseconds with two positions, ordered by
 * minimum and maximum value respectively.
 *
 * @example
 * ```typescript
 * const latence: LatencyConfig = {read: [5,10], write: [10, 20]}
 * ```
 */
type LatencyConfig = { read: [number, number]; write: [number, number] };

/**
 * Describes the settings for simulating failures in read and write operations and corrupted file.
 *
 * @property corruptWrite: simulate that the central database file is corrupted
 *
 * @property failProbability: The number between 0 and 1 that will be the threshold for generating a fault.
 *
 * @exemple
 * ```typescript
 * const fault: FaultConfig = {corruptWrite: false, failProbability: 0.58};
 * ```
 */
type FaultConfig = { corruptWrite?: boolean; failProbability?: number };

type MockedFs = {
    readFile: jest.MockedFunction<typeof fs.readFile>;
    writeFile: jest.MockedFunction<typeof fs.writeFile>;
    /**
     * Internal state simulating the file's contents.
     */
    _fileState: string | null;
};

/**

* Creates a mock file/promise with internal state that persists between calls.
*
* @param initialContent Initial content of the file (JSON string, e.g., '{}').
* @param fileExists Defines whether the file "exists" initially.
* @param latence Object with maximum and minimum values to define random time to simulate the return of operations in milliseconds.
*/
export function createMockFs(
    initialContent: string | null = '{}',
    fileExists = true,
    latency?: LatencyConfig,
    faults: FaultConfig = {},
): MockedFs {
    const mockFs: Partial<MockedFs> = {
        _fileState: fileExists ? initialContent : null,
    };

    const readFileMock = jest.fn(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        async (path: PathLike, options?: any): Promise<any> => {
            if (latency !== undefined) {
                await randomDelay(latency.read[0], latency.read[1]);
            }

            if (mockFs._fileState == null) {
                const err: NodeJS.ErrnoException = new Error('File not found');
                err.code = 'ENOENT';
                throw err;
            }
            if (
                faults.failProbability &&
                Math.random() < faults.failProbability
            ) {
                const err = new Error('Simulated read failure');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (err as any).code = 'EIO';
                throw err;
            }
            return mockFs._fileState;
        },
    ) as MockedFs['readFile'];

    const writeFileMock = jest.fn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        async (path: PathLike, data: any, options?: any): Promise<void> => {
            // It simulates a writing process that replaces the contents of the "file".
            if (latency !== undefined) {
                await randomDelay(latency.write[0], latency.write[1]);
            }

            if (
                faults.failProbability &&
                Math.random() < faults.failProbability
            ) {
                const err = new Error('Simulated write failure');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (err as any).code = 'EIO';
                throw err;
            }

            if (faults.corruptWrite && Math.random() < 0.3) {
                mockFs._fileState = data.toString().slice(0, -5); // corrompe final
            } else {
                mockFs._fileState = data.toString();
            }

            return Promise.resolve();
        },
    ) as MockedFs['writeFile'];

    jest.spyOn(fs, 'readFile').mockImplementation(
        readFileMock as unknown as typeof fs.readFile,
    );
    jest.spyOn(fs, 'writeFile').mockImplementation(
        writeFileMock as unknown as typeof fs.writeFile,
    );

    mockFs.readFile = readFileMock as unknown as jest.MockedFunction<
        typeof fs.readFile
    >;
    mockFs.writeFile = writeFileMock as unknown as jest.MockedFunction<
        typeof fs.writeFile
    >;

    return mockFs as MockedFs;
}

function randomDelay(min: number, max: number): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Restores the original behavior of fs/promises after testing.
 */
export function restoreFsMocks() {
    jest.restoreAllMocks();
}
