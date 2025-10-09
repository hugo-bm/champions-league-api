import { Club } from "../models/Club";
import { IClubRepository } from "./IClubRepository";
import { JSONBaseRepository } from "./JSONBaseRepository";


export class ClubRepository extends JSONBaseRepository<Club> implements IClubRepository {
    constructor(){
        super("clubs");
    }
    async findAll(): Promise<Club[]> {
        return await this.findAll();
    }
    async findById(id: number): Promise<Club | null> {
        return await this.findBy("id", id);
    }
    async create(club: Club): Promise<Club> {
        this.insert(club);
        return club;
    }
        
}