import { CreateClubDTO } from "../dtos/CreateClubDTO";
import { Club } from "../models/Club";
import { IClubRepository } from "../repositories/IClubRepository";
import { IClubService } from "./IClubService";

/**
 * Service responsible for handling business logic related to {@link Club} entities.
 *
 * @remarks
 * This class implements the {@link IClubService} interface and provides
 * an abstraction layer between controllers and repositories.  
 * It ensures that all validation and entity creation logic remains centralized.
 */
export class ClubService implements IClubService {
      /**
   * Creates an instance of {@link ClubService}.
   *
   * @param repository - The repository responsible for data persistence of club entities.
   *
   * @example
   * ```ts
   * const repository = new ClubRepository();
   * const service = new ClubService(repository);
   * ```
   */
    constructor (private repository: IClubRepository){}

    list(): Promise<Club[]> {
        return this.repository.findAll()
    }
    getById(id: number): Promise<Club | null> {
        const club = this.repository.findById(id);
        return club;
    }
    /**
     *  @throws {Error} If the `name` or `country` fields are missing in the provided DTO.
     *   * @param dto - The data transfer object containing club creation fields.
   * @returns A promise resolving to the created {@link Club} entity.
   *
   * @example
   * ```ts
   * const newClub = await clubService.create({ name: "Liverpool", country: "England" });
   * console.log(newClub.id);
   * ```
     *  @internal
     * The implementation uses the total number of persisted items plus 1 as the new available ID.
     */
    async create(dto: CreateClubDTO): Promise<Club> {
        if (!dto.name || !dto.country) throw new Error("name and country are required");
        const id: number = (await this.list()).length + 1;
        const club: Club = {id: id, ...dto};
        return this.repository.create(club);
    }
    
}