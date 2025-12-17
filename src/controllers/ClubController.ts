import HttpError from '../errors/HttpError';
import { IClubService } from '../services/IClubService';
import { Request, Response } from 'express';

/**
 * Controller responsible for handling HTTP requests related to {@link Club} entities.
 *
 * @remarks
 * The {@link ClubController} acts as an entry point for Express routes related to clubs.
 * It delegates business logic to the {@link IClubService}, ensuring that each endpoint
 * focuses solely on request validation, response formatting, and error handling.
 *
 * This controller currently provides endpoints for listing all clubs and retrieving
 * a club by its ID.
 *
 * @example
 * ```ts
 * import express from "express";
 * import { ClubController } from "./controllers/ClubController";
 * import { ClubService } from "./services/ClubService";
 * import { ClubRepository } from "./repositories/ClubRepository";
 *
 * const router = express.Router();
 * const controller = new ClubController(new ClubService(new ClubRepository()));
 *
 * router.get("/clubs", controller.list.bind(controller));
 * router.get("/clubs/:id", controller.getById.bind(controller));
 * ```
 */
export class ClubController {
    /**
     * Creates an instance of {@link ClubController}.
     *
     * @param service - The {@link IClubService} implementation used to perform business operations.
     */
    constructor(private service: IClubService) {}

    /**
     * Handles HTTP GET requests to retrieve all clubs.
     *
     * @param req - The Express request object.
     * @param res - The Express response object.
     * @returns A JSON response containing the list of all registered clubs.
     *
     * @example
     * ```bash
     * GET /clubs
     * ```
     *
     * @example
     * ```json
     * [
     *   { "id": 1, "name": "Liverpool", "country": "England" },
     *   { "id": 2, "name": "Real Madrid", "country": "Spain" }
     * ]
     * ```
     */
    async list(req: Request, res: Response) {
        const clubs = await this.service.list();
        return res.json(clubs);
    }

    /**
     * Handles HTTP GET requests to retrieve a single club by its ID.
     *
     * @param req - The Express request object containing the club ID in `req.params.id`.
     * @param res - The Express response object.
     * @returns A JSON response with the club data if found.
     *
     * @throws {HttpError} `400` - When the ID is missing or invalid.
     * @throws {HttpError} `404` - When no club is found with the specified ID.
     *
     * @example
     * ```bash
     * GET /clubs/1
     * ```
     *
     * @example
     * ```json
     * { "id": 1, "name": "Liverpool", "country": "England" }
     * ```
     */
    async getById(req: Request, res: Response) {
        const reqID = req.params.id;

        const id = parseInt(reqID!);
        if (isNaN(id) && !isFinite(Number(reqID)) || id < 0) {
            throw new HttpError(400, 'ID information is not valid');
        }

        const club = await this.service.getById(id);
        if (!club) {
            throw new HttpError(404, 'Club not found');
        } else {
            return res.json(club);
        }
    }
}
