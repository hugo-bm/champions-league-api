
/**
 * DTO for creating a new club
 *
 *@description This interface allows you to create an object that encapsulates the data
 *needed to register a club in the system. It is used in conjunction with
 *the CLI interface to ensure the structure of the received data is correct.
 * 
 * @example
 * ```typescript
 * const newClub: CreateClubDTO = {
 *  name: 'Real Madrid',
 *  country: 'Spain',
 * }
 * ``` 
 */
export interface CreateClubDTO {
    /** @property Name of the football club */
    name: string,
    /** @property Country where the club is based */
    country: string,
}