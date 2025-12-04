import { Router } from "express";
import { ClubController } from "../controllers/ClubController";

/**
 * Creates and configures an Express router for handling {@link Club} endpoints.
 *
 * @remarks
 * This function defines all HTTP routes related to the `Club` resource and
 * delegates their handling to the provided {@link ClubController}.
 *
 * Routes:
 * - `GET /` — Retrieves all clubs.
 * - `GET /:id` — Retrieves a single club by ID.
 *
 * The controller methods are bound to preserve `this` context when passed
 * directly as Express route handlers.
 *
 * @param controller - An instance of {@link ClubController} used to handle incoming requests.
 * @returns An Express {@link Router} configured with all club-related routes.
 *
 * @example
 * ```ts
 * import express from "express";
 * import { ClubController } from "./controllers/ClubController";
 * import { ClubService } from "./services/ClubService";
 * import { ClubRepository } from "./repositories/ClubRepository";
 * import CreateClubRouter from "./routes/ClubRouter";
 *
 * const app = express();
 * const controller = new ClubController(
 *   new ClubService(new ClubRepository())
 * );
 *
 * app.use("/clubs", CreateClubRouter(controller));
 *
 * app.listen(3000, () => console.log("Server running on port 3000"));
 * ```
 */
export default function CreateClubRouter(controller: ClubController){
    const router: Router = Router();
    router.get("/",controller.list.bind(controller));
    router.get("/:id", controller.getById.bind(controller));
    return router;
}