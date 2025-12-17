/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSONDatabase } from '../src/database/JSONDatabase';
import { createMockFs, restoreFsMocks } from './helpers/mockFsHelper';

interface test {
    value: number;
}

describe('JSON Database Tests:', () => {
    let mockFs: ReturnType<typeof createMockFs>;

    beforeEach(() => {
        (JSONDatabase as any).instance = undefined;
        mockFs = createMockFs('{}', true);
        jest.clearAllMocks();
    });

    afterEach(() => {
        restoreFsMocks();
    });

    it('should create file on first read if not exists', async () => {
        mockFs = createMockFs(null, false); // file not exist

        const db = JSONDatabase.getInstance();

        const result = await db.getCollection<test>('test');

        expect(result).toEqual({ count: 0, data: [] });
        expect(mockFs.readFile).toHaveBeenCalled();
        expect(mockFs.writeFile).toHaveBeenCalled();
    });

    it('should handle concurrent writes without corruption', async () => {
        const db = JSONDatabase.getInstance();

        const N = 50;
        const collection: string = 'test';

        const operations: Promise<void>[] = [];

        for (let i = 0; i < N; i++) {
            operations.push(db.insert<test>(collection, { value: i }));
        }

        await Promise.all(operations);

        // It confirms that all the writings took place.
        expect(mockFs.writeFile).toHaveBeenCalledTimes(N);
        // Get the final contents of the "file"
        const finalState = JSON.parse(mockFs._fileState!);
        expect(finalState).toHaveProperty(collection);

        const collectionData = finalState[collection].data;
        expect(collectionData.length).toBe(N);
        // Atomicity → no partial writes (checks if the final JSON is valid)
        expect(() => JSON.parse(mockFs._fileState!)).not.toThrow();
        // Consistency → accurate counting
        expect(finalState[collection].count).toBe(N);
        // Isolation → preserved execution order
        const ids = collectionData.map((i: test) => i.value);
        expect(ids.every((id, idx) => id === idx)).toBe(true);
    });

    it('should remain consistent under 200 concurrent writes with random delays', async () => {
        const db = JSONDatabase.getInstance();
        mockFs = createMockFs('{}', true, { read: [1, 10], write: [5, 15] });

        const N = 150;
        const collection: string = 'records';

        const operations: Promise<void>[] = [];

        for (let i = 0; i < N; i++) {
            operations.push(
                db.insert(collection, { index: i, timestamp: Date.now() }),
            );
        }

        await Promise.all(operations);

        const finalState = JSON.parse(mockFs._fileState!);
        const data = finalState[collection].data;

        expect(data).toHaveLength(N);
        expect(finalState[collection].count).toBe(N);
    });

    it('should clear the collections', async () => {
        const db = JSONDatabase.getInstance();
        mockFs = createMockFs(
            '{"test": {"data": [{"id": 1, "value": "xp"}], "count": 1 }}',
            true,
        );
        // Checking if the simulation contains the basic data
        expect(JSON.parse(mockFs._fileState!)['test'].count).toBe(1);

        await db.clearCollection('test');

        const finalState = JSON.parse(mockFs._fileState!);

        // Checking if the test date will be removed
        expect(finalState['test'].count).toBe(0);
        expect(finalState['test'].data).toHaveLength(0);
    });

    it('should insert multiple collections in the file without corruption', async () => {
        const db = JSONDatabase.getInstance();

        const colections: number = 50;
        const itens: number = 20;

        const operations: Promise<void>[] = [];

        for (let i = 0; i < colections; i++) {
            for (let j = 0; j < itens; j++) {
                operations.push(db.insert<test>(`test_${i}`, { value: j }));
            }
        }

        await Promise.all(operations);

        // It confirms that all the writings took place.
        expect(mockFs.writeFile).toHaveBeenCalledTimes(colections * itens);
        // Get the final contents of the "file" from the last collection.
        const finalState = JSON.parse(mockFs._fileState!);
        expect(finalState).toHaveProperty(`test_${colections - 1}`);

        const collectionData = finalState[`test_${colections - 1}`].data;
        expect(collectionData).toHaveLength(itens);

        // Atomicity → no partial writes (checks if the final JSON is valid)
        expect(() => JSON.parse(mockFs._fileState!)).not.toThrow();
        // Consistency → accurate counting
        const arrColectionCount: number[] = Object.values(finalState).map(
            (collection: any) => collection.count,
        );
        expect(
            arrColectionCount.every((value: number) => value === itens),
        ).toBe(true);

        // Isolation → preserved execution order
        const dataOfAllColections = Object.values(finalState).map(
            (collection: any) => collection.data,
        );
        // Get a matrix with the numerical values of all collections.
        const matrixOfValues = dataOfAllColections.map((i: test[]) => {
            return i.map((item) => item.value);
        });
        //Check if the values were written correctly (ascending sequence).
        const result: boolean[] = matrixOfValues.map((arr) =>
            arr.every(
                (value, index, array) =>
                    index === 0 || (value >= array[index - 1] && value < itens),
            ),
        );

        // check
        expect(result.every(Boolean)).toBe(true);
    });
});

describe('JSON Database file corruption tests:', () => {
    let mockFs: ReturnType<typeof createMockFs>;

    beforeEach(() => {
        (JSONDatabase as any).instance = undefined;
        jest.clearAllMocks();
    });

    afterEach(() => {
        restoreFsMocks();
    });

    it('should detect corruption during competing operations.', async () => {
        const db = JSONDatabase.getInstance();
        mockFs = createMockFs('{}', true, undefined, { corruptWrite: true });

        const operations: Promise<void>[] = [];

        for (let i = 0; i < 10; i++) {
            operations.push(db.insert<test>('test', { value: i }));
        }

        const results = await Promise.allSettled(operations);
        const rejected = results.filter((r) => r.status === 'rejected');
        expect(rejected.length).toBeGreaterThan(0);

        // Checking if the simulated file was actually corrupted
        try {
            JSON.parse(mockFs._fileState!);
        } catch (error) {
            expect(error).toBeInstanceOf(SyntaxError);
        }
    });
    it('It should detect corruption during simultaneous operations with random delays.', async () => {
        const db = JSONDatabase.getInstance();
        mockFs = createMockFs(
            '{}',
            true,
            { read: [1, 10], write: [5, 15] },
            { corruptWrite: true },
        );

        const operations: Promise<void>[] = [];

        for (let i = 0; i < 30; i++) {
            operations.push(db.insert<test>('test', { value: i }));
        }

        const results = await Promise.allSettled(operations);
        const rejected = results.filter((r) => r.status === 'rejected');
        expect(rejected.length).toBeGreaterThan(0);

        // Checking if the simulated file was actually corrupted
        try {
            JSON.parse(mockFs._fileState!);
        } catch (error) {
            expect(error).toBeInstanceOf(SyntaxError);
        }
    });
    it('It must detect faults during simultaneous operations with random delays and a 40% probability of failure.', async () => {
        const db = JSONDatabase.getInstance();
        mockFs = createMockFs(
            '{}',
            true,
            { read: [1, 10], write: [5, 15] },
            { failProbability: 0.4 },
        );

        const writeOps: Promise<void>[] = [];
        const readOps: Promise<{
            data: test[];
            count: number;
        }>[] = [];

        for (let i = 0; i < 30; i++) {
            writeOps.push(db.insert<test>('test', { value: i }));
        }

        for (let i = 0; i < 30; i++) {
            readOps.push(db.getCollection<test>('test'));
        }

        const writeResults = await Promise.allSettled(writeOps);
        const readResults = await Promise.allSettled(readOps);
        const rejected = writeResults.filter((r) => r.status === 'rejected');
        rejected.concat(readResults.filter((r) => r.status === 'rejected'));
        console.log(String(rejected[0].reason));
        expect(rejected.length).toBeGreaterThan(0);

        expect(rejected.every((task)=>String(task.reason).match(new RegExp(
            /^.*\[DatabaseError\] Operation: (?:READ|WRITE) \| Description: Simulated (?:read|write) failure/i,
        )))).toBe(true);

        // Checking if the simulated file was actually corrupted
        try {
            JSON.parse(mockFs._fileState!);
        } catch (error) {
            expect(error).toBeInstanceOf(SyntaxError);
        }
    });
});