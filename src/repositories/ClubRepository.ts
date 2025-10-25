import { Club } from "../models/Club";
import { IClubRepository } from "./IClubRepository";
import { JSONBaseRepository } from "./JSONBaseRepository";


export class ClubRepository implements IClubRepository {
    private baseRepository: JSONBaseRepository<Club>;
    constructor(){
        this.baseRepository = new JSONBaseRepository<Club>("clubs");
    }
    async findAll(): Promise<Club[]> {
        return await this.baseRepository.findAll();
    }
    async findById(id: number): Promise<Club | null> {
        return await this.baseRepository.findBy("id", id);
    }
    async create(club: Club): Promise<Club> {
        this.baseRepository.insert(club);
        return club;
    }
        
}