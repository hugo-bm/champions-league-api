import { CreateClubDTO } from "../dtos/CreateClubDTO";
import { Club } from "../models/Club";

/**
 * Defines the contract for business logic operations
 * related to {@link Club} entities.
 *
 * @remarks
 * The {@link IClubService} interface represents the service layer
 * between controllers and repositories, ensuring separation of concerns.
 * Implementations are responsible repository calls
 * and domain rules before data persistence.
 *
 * @example
 * ```ts
 * const service: IClubService = new ClubService();
 * const clubs = await service.list();
 * console.log(clubs);
 * ```
 */
export interface IClubService{

    /**
   * Retrieves all registered clubs.
   *
   * @returns A promise resolving to an array of {@link Club} entities.
   * If no clubs exist, resolves to an empty array.
   *
   * @example
   * ```ts
   * const clubs = await clubService.list();
   * console.log(clubs.length); // 0 or more
   * ```
   */
    list(): Promise<Club[]>;

     /**
   * Retrieves a club by its unique identifier.
   *
   * @param id - The unique numeric identifier of the club.
   * @returns A promise resolving to the matching {@link Club} entity,
   * or `null` if no entity is found with the provided ID.
   *
   * @example
   * ```ts
   * const club = await clubService.getById(1);
   * if (club) console.log(club.name);
   * ```
   */
    getById(id: number): Promise<Club | null>;

    /**
   * Creates and persists a new club entity.
   *
   * @param dto - The data transfer object containing club creation fields.
   * @returns A promise resolving to the created {@link Club} entity.
   *
   * @example
   * ```ts
   * const newClub = await clubService.create({ name: "Liverpool", country: "England" });
   * console.log(newClub.id);
   * ```
   * 
   * @internal 
   */
    create(dto: CreateClubDTO): Promise<Club>;
}