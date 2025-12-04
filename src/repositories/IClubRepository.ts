import {Club} from '../models/Club';

/**
 * Represents the contract for data access operations related to User entities.
 * 
 * This interface defines the operations for creating and reading any domain-specific
 * queries needed to manage club data, abstracting away the persistence layer.
 * 
 * @remarks 
 * 
 * This interface follows the Repository Pattern, providing a clear separation between
 * domain logic and the data access layer.
 * Implementations can utilize different data sources, such as databases, files,
 * or in-memory storage. * 
 */
export interface IClubRepository {

    /** 
     * Retrieves a list of Club entity.
     * 
     * 
     * @return A promise resolved to a list of club-type entities, or an empty list if none was found.
     */
    findAll(): Promise<Club[]>;

    /** 
     * Retrieves a Club entity by its unique identifier.
     * 
     * @param id - The uniquer identifier of the club.
     * @return A promise resolving to the matching club entity, or `null` if not found.
     */
    findById(id: number): Promise<Club | null>;

    /**
   * Persists a new club entity in the underlying data store.
   *
   * @param club - The club data to be create entity.
   * @returns A promise resolving to the created club with any generated fields (e.g., ID).
   */
    create(club: Club): Promise<Club>;
}