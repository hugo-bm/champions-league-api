import { CreateClubDTO } from "../dtos/CreateClubDTO";
import { Club } from "../models/Club";

export interface IClubService{
    list(): Promise<Club[]>;
    getById(id: number): Promise<Club | null>;
    create(dto: CreateClubDTO): Promise<Club>;
}