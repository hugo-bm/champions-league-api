import { JSONDatabase } from "../database/JSONDatabase";

/**
 * Generic repository abstraction for managing a specific collection in the JSON database.
 *
 * @typeParam T - The entity type stored within the collection.
 *
 * @remarks
 * The {@link JSONBaseRepository} provides high-level CRUD operations on top of the
 * {@link JSONDatabase} singleton, using a collection-based structure.
 *
 * It is designed to be extended by concrete repositories (e.g., `ClubRepository`,
 * `PlayerRepository`) that define entity-specific behavior.
 *
 * @example
 * ```ts
 * interface Club {
 *   id: string;
 *   name: string;
 * }
 *
 * class ClubRepository extends BaseRepository<Club> {
 *   constructor() {
 *     super("clubs");
 *   }
 * }
 *
 * const repo = new ClubRepository();
 * await repo.insert({ id: "1", name: "Liverpool" });
 * console.log(await repo.findAll());
 * ```
 */
export class JSONBaseRepository<T extends Record<string, any>>{

    protected readonly collection: string;
    protected readonly db: JSONDatabase;

    /**
   * Creates a new repository instance for a given collection name.
   *
   * @param collection - The name of the collection associated with this repository.
   */
    constructor(collection: string){
        this.collection = collection;
        this.db = JSONDatabase.getInstance();
    }

    /**
     * Retrieves all items in the repository's collection
     * 
     * @returns A promise resolving to an array of all stored entities
     */
    async findAll(): Promise<T[]> {
        const {data} = await this.db.getCollection<T>(this.collection);
        return data;
    }
    /**
     * Inserts a new item into the collection
     * 
     * @param item - The entity to insert
     */
    async insert(item: T): Promise<void>{
        await this.db.insert<T>(this.collection, item);
    }
/**
 * Finds a single entity that matches the given key-value pair.
 *
 * This method allows dynamic lookups of entities based on any property key
 * of the generic type `T`. The key must be a valid property name of `T`,
 * and the value must match the corresponding property type.
 *
 * If no entity matches the specified condition, the method resolves with `null`.
 *
 * @typeParam T - The type of the entity stored or managed by the repository.
 * @typeParam K - The property name (key) within `T` to search by.
 *
 * @param key - The property key of the entity to compare against.
 * @param value - The value to match for the given property key. Must match
 * the type of the corresponding property in `T`.
 *
 * @returns A `Promise` that resolves with the found entity (`T`) or `null` if
 * no entity matches the given key-value condition.
 *
 * @example
 * ```ts
 * interface Club {
 *   id: number;
 *   name: string;
 *   country: string;
 * }
 *
 * class ClubRepository {
 *   private clubs: Club[] = [
 *     { id: 1, name: "Liverpool", country: "England" },
 *     { id: 2, name: "Paris Saint-Germain", country: "France" },
 *   ];
 *
 *   async findBy<K extends keyof Club>(key: K, value: Club[K]): Promise<Club | null> {
 *     return this.clubs.find((club) => club[key] === value) || null;
 *   }
 * }
 *
 * const repo = new ClubRepository();
 *
 * // ✅ Correct usages
 * const club1 = await repo.findBy("id", 1);
 * constclub2 = await repo.findBy("country", "England");
 *
 * // ❌ Invalid usage (compile-time error)
 * // const invalid = await repo.findBy("name", 42);
 * ```
 */
    async findBy<K extends keyof T>(key: K, value: T[K]): Promise<T | null> {
        const ALL = await this.findAll();
        return ALL.find((item)=>item[key] === value) ?? null;
    }
/**
 * Deletes one or more entities that match the given key-value condition.
 *
 * This method removes all entities from the repository whose property `key`
 * matches the provided `value`. The `key` must be a valid property name of `T`,
 * and the `value` must match the type of that property.
 *
 * If no entities match the condition, the operation completes silently
 * without throwing an error.
 *
 * @typeParam T - The type of the entity stored or managed by the repository.
 * @typeParam K - The property name (key) within `T` to match against.
 *
 * @param key - The property key of the entity to compare against.
 * @param value - The value to match for the given property key. Must match
 * the type of the corresponding property in `T`.
 *
 * @returns A `Promise<void>` that resolves once the deletion operation completes.
 * The promise never rejects due to missing entities; it only rejects if an
 * unexpected error occurs during execution (e.g., database error).
 *
 * @example
 * ```ts
 * interface Club {
 *   id: number;
 *   name: string;
 *   country: string;
 * }
 *
 * class UserRepository {
 *   private clubs: Club[] = [
 *     { id: 1, name: "Liverpool", country: "England" },
 *     { id: 2, name: "Paris Saint-Germain", country: "France" },
 *   ];
 *
 *   async deleteBy<K extends keyof Club>(key: K, value: Club[K]): Promise<void> {
 *     this.clubs = this.clubs.filter((club) => club[key] !== value);
 *   }
 * }
 *
 * const repo = new ClubRepository();
 *
 * // ✅ Deletes all clubs with the specified name
 * await repo.deleteBy("name", "Liverpool");
 *
 * // ✅ Deletes club by ID
 * await repo.deleteBy("id", 2);
 *
 * // ❌ Invalid usage (compile-time error)
 * // await repo.deleteBy("email", 123);
 * ```
 *
 */
    async deleteBy<K extends keyof T>(key: K, value: T[K]): Promise<void> {
        const ALL = await this.findAll();
        const FILTERED = ALL.filter((item)=>item[key] !== value);
        this.db.setCollection(this.collection, FILTERED);
    }

}