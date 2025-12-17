/**

@fileoverview Provides the dependency injection wiring and router setup for the Club domain.

This module acts as a simple container (or wiring function) that instantiates the repository,

service, and controller layers, connects their dependencies, and builds the final Express router.
*/

import { Response, Router } from "express";
import { ClubController } from "./controllers/ClubController";
import { ClubRepository } from "./repositories/ClubRepository";
import { ClubService } from "./services/ClubService";
import CreateClubRouter from "./routes/club.routes";

/**
 * Builds and returns the main Express router for the application.
 *
 * This function wires together the dependencies required for the Club feature:
 * - Instantiates a `ClubRepository` for data access.
 * - Wraps it in a `ClubService` that handles business logic.
 * - Connects the service to a `ClubController` that exposes endpoints.
 * - Finally, mounts the controller’s routes under `/api/v1/clubs`
 *   and adds a simple `/api/v1/health` endpoint for health checks.
 *
 * @function
 * @returns {Router} The configured Express router instance ready to be mounted in the app.
 *
 * @example
 * ```ts
 * import express from "express";
 * import { buildRouter } from "./container";
 *
 * const app = express();
 * app.use(buildRouter());
 * app.listen(3000, () => console.log("Server running on port 3000"));
 * ```
 */
export function buildRouter(){
    const repo = new ClubRepository();
    const service = new ClubService(repo);
    const controller = new ClubController(service);

    const router: Router = Router();
    router.use("/api/v1/clubs", CreateClubRouter(controller));
    router.get("/api/v1/health", (_,res: Response)=>res.json({status: 'ok'}));
    return router;
}