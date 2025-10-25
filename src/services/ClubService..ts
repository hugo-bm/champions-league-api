import { CreateClubDTO } from "../dtos/CreateClubDTO";
import { Club } from "../models/Club";
import { IClubRepository } from "../repositories/IClubRepository";
import { IClubService } from "./IClubService";

export class ClubService implements IClubService {
    constructor (private repository: IClubRepository){}

    list(): Promise<Club[]> {
        return this.repository.findAll()
    }
    getById(id: number): Promise<Club | null> {
        const club = this.repository.findById(id);
        return club;
    }
    async create(dto: CreateClubDTO): Promise<Club> {
        if (!dto.name || !dto.country) throw new Error("name and country are required");
        const id: number = (await this.list()).length + 1;
        const club: Club = {id: id, ...dto};
        return this.repository.create(club);
    }
    
}