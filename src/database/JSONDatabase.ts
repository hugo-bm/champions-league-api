/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'node:path';
import { promises as fs } from 'node:fs';
import JSONDatabaseError from '../errors/JSONDatabaseError';

/**
 * Singleton class that manages a lightweight JSON-based database.
 *
 * @remarks
 * The {@link JSONDatabase} class provides a simple, file-based persistence layer that
 * supports generic collections, each stored as a structured object containing
 * `data` and a `count` field. 
 *
 * It ensures thread-safe asynchronous access through an internal promise queue,
 * meaning multiple concurrent requests will be processed sequentially to avoid
 * file corruption.
 * 
 */
export class JSONDatabase {
    private readonly filePath: string;
    private static instance: JSONDatabase;
    /**
     * Internal promise chain used to serialize asynchronous task execution.
     * It always resolves after the most recently enqueued task completes.
     * @internal
     */
    private queue: Promise<void> = Promise.resolve();

    private constructor() {
        this.filePath = path.resolve(__dirname, './data.json');
    }

    /**
     * Returns the singleton instance of the {@link JSONDatabase}.
     *
     * @returns The unique instance shared across the entire application.
     */
    public static getInstance(): JSONDatabase {
        if (!JSONDatabase.instance) {
            JSONDatabase.instance = new JSONDatabase();
        }
        return JSONDatabase.instance;
    }
    /**
     * Reads and parses the database JSON file from disk.
     *
     * @returns A parsed object representing the full database state.
     * @throws If the JSON file cannot be parsed or read (except when missing).
     */

    private async readData(): Promise<Record<string, any>> {
        try {
            const DATA = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(DATA);
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(this.filePath, '{}', 'utf-8');
                return {};
            }
            throw new JSONDatabaseError((error as Error).message,"r");
        }
    }

    /**
     * Writes the given data to the JSON file
     *
     * @param data - The entire database object to be persisted
     */

    private async writeData(data: Record<string, any>): Promise<void> {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            throw new JSONDatabaseError((error as Error).message,"w");
        }
    }

    /**
     * Enqueues an asynchronous task to be executed sequentially after all previously
     * enqueued tasks have finished.
     *
     * This method ensures that tasks are executed **one at a time**, in the same order
     * they were added. Each task will only start after the previous one completes,
     * regardless of success or failure.
     *
     * @typeParam T - The type of the value that the provided task resolves with.
     *
     * @param task - A function returning a `Promise<T>` representing the asynchronous
     * operation to be queued and executed.
     *
     * @returns A `Promise<T>` that resolves or rejects with the same result as the provided
     * task. Unlike the internal queue, the returned promise will propagate errors
     * to the caller, allowing for proper error handling.
     *
     * @example
     * ```ts
     * const queue = new Queue();
     *
     * // Tasks run in sequence, not in parallel
     * queue.enqueue(async () => {
     *   await wait(100);
     *   console.log("Task A");
     * });
     *
     * queue.enqueue(async () => {
     *   console.log("Task B");
     * });
     *
     * // Output order:
     * // Task A
     * // Task B
     * ```
     *
     * @remarks
     * Internally, the queue maintains a promise chain (`this.queue`) that tracks
     * the completion of all tasks. Each new task is appended to the chain using
     * `.then()` and `.finally()` to ensure proper sequencing and resilience
     * to errors.
     */
    private async enqueue<T>(task: () => Promise<T>) {
        // Added the new task to queue and wait for completion
        const RESULT = this.queue.then(() => task());

        this.queue = (RESULT as Promise<void>).catch(() => undefined);

        return RESULT;
    }

    /**
     * Ensures the given collection exists, initializing it if needed.
     *
     * @param data - The database object in memory.
     *
     * @param name - The name of the collection in which to check if it exists
     *
     * @remarks
     * A collection is represented as an object containing:
     * ```json
     * {
     *   "collectionName": {
     *     "data": [],
     *     "count": 0
     *   }
     * }
     * ```
     */
    private ensureCollection(data: Record<string, any>, name: string) {
        if (!data[name]) {
            data[name] = { data: [], count: 0 };
        }
    }

    /**
     * Retrieves all items in a collection.
     *
     * @param name - The name of the collection you want to get all items from
     *
     * @typeParam T - The type of the elements stored in the collection.
     *
     * @returns An object containing the `data` array and the `count` of elements.
     *
     *    * @example
     * ```ts
     * const players = await db.getCollection<Player>("players");
     * console.log(players.count); // e.g., 3
     * ```
     */
    public async getCollection<T = any>(
        name: string,
    ): Promise<{ data: T[]; count: number }> {
        return this.enqueue(async () => {
            const DB = await this.readData();
            this.ensureCollection(DB, name);
            return DB[name];
        });
    }
    /**
     * Inserts a new item into a collection.
     *
     * @typeParam T - The type of the entity being stored.
     *
     * @param name - The collection name
     *
     * @param item - The item to be inserted.
     */
    public async insert<T = any>(name: string, item: T): Promise<void> {
        return this.enqueue(async () => {
            const DB = await this.readData();
            this.ensureCollection(DB, name);
            DB[name].data.push(item);
            DB[name].count += 1;
            await this.writeData(DB);
        });
    }

    /**
     * Replaces the entire data array of a collection.
     *
     * @typeParam T - The type of entities to be stored in the collection.
     *
     * @param name - The name of collection that will be replaced
     *
     * @param newData - The new array of items to store.
     */
    public async setCollection<T = any>(
        name: string,
        newData: T[],
    ): Promise<void> {
        return this.enqueue(async () => {
            const DB = await this.readData();
            this.ensureCollection(DB, name);
            DB[name].data = newData;
            DB[name].count = newData.length;
            await this.writeData(DB);
        });
    }
    /**
     * Deletes all data from a collection but keeps its structure.
     *
     * @param name - The name of collection that will be replaced
     *
     * @example
     * ```ts
     * await db.clearCollection("logs");
     * // db.json will still contain:
     * // { "logs": { "data": [], "count": 0 } }
     * ```
     *
     */
    public async clearCollection(name: string): Promise<void> {
        return this.enqueue(async () => {
            const DB = await this.readData();
            this.ensureCollection(DB, name);
            DB[name].data = [];
            DB[name].count = 0;
            await this.writeData(DB);
        });
    }
}
