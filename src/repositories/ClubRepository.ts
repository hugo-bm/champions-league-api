import { Club } from "../models/Club";
import { IClubRepository } from "./IClubRepository";
import { JSONBaseRepository } from "./JSONBaseRepository";

/**
 * Repository implementation for managing {@link Club} entities.
 *
 * @implements {IClubRepository}
 *
 * @remarks
 * The {@link ClubRepository} acts as a concrete data-access layer for the `Club` entity,
 * delegating persistence operations to a shared {@link JSONBaseRepository} instance
 * configured to use the `"clubs"` collection.
 *
 * It fulfills the contract defined by {@link IClubRepository}, providing methods
 * to retrieve, create, and look up clubs by ID.
 *
 * @example
 * ```ts
 * const repo = new ClubRepository();
 * await repo.create({ id: 1, name: "Liverpool" });
 * const clubs = await repo.findAll();
 * console.log(clubs);
 * ```
 */
export class ClubRepository implements IClubRepository {
    private baseRepository: JSONBaseRepository<Club>;

    /**
   * Initializes a new {@link ClubRepository} instance.
   *
   * @constructor
   * @remarks
   * Internally, this constructor instantiates a {@link JSONBaseRepository}
   * bound to the `"clubs"` collection of the JSON database, enabling
   * CRUD operations specific to `Club` entities.
   */
    constructor(){
        this.baseRepository = new JSONBaseRepository<Club>("clubs");
    }

     /**
   * @inheritdoc
   * @override
   * @remarks
   * This implementation simply delegates to {@link JSONBaseRepository.findAll}.
   */
    async findAll(): Promise<Club[]> {
        return await this.baseRepository.findAll();
    }

    /**
   * @inheritdoc
   * @override
   * @remarks
   * Delegates to {@link JSONBaseRepository.findBy}, filtering by the `"id"` field.
   */
    async findById(id: number): Promise<Club | null> {
        return await this.baseRepository.findBy("id", id);
    }

    /**
   * @inheritdoc
   * @override
   * @remarks
   * Inserts the provided club entity into the `"clubs"` collection.
   * This implementation immediately returns the inserted entity
   * without reloading it from storage.
   */
    async create(club: Club): Promise<Club> {
        this.baseRepository.insert(club);
        return club;
    }
        
}