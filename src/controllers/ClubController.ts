import HttpError from "../errors/HttpError";
import { IClubService } from "../services/IClubService";
import { Request, Response } from "express";

export class ClubController {
    constructor(private service: IClubService) { }

    async list(req: Request, res: Response) {
        const clubs = await this.service.list();
        return res.json(clubs);
    }

    async getById(req: Request, res: Response) {

        const reqID = req.params.id;

        if (reqID === undefined) {
            throw new HttpError(400, "ID information is required");
        }
        const id = parseInt(reqID);
        if (!isNaN(id) && !isFinite(Number(reqID))) {
            throw new HttpError(400, "ID information is not valid");
        }

        const club = await this.service.getById(id);
        if (!club) {
            throw new HttpError(404, "Club not found");
        }
        else {
            return res.json(club);
        }
    }

}