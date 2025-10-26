import { Request, Response, NextFunction } from 'express';
import HttpError from '../errors/HttpError';

/**
 * Express middleware responsible for centralized error handling.
 *
 * @remarks
 * This middleware should be registered **after all routes** in your Express app.
 * It catches both known {@link HttpError} instances and unexpected exceptions,
 * ensuring consistent JSON error responses.
 *
 * @param err - The error object passed by previous middleware or route handlers.
 * @param req - The incoming Express {@link Request} object.
 * @param res - The outgoing Express {@link Response} object used to send responses.
 * @param next - The {@link NextFunction} used to delegate control to the next middleware.
 *
 * @returns An Express JSON response containing the error message and appropriate HTTP status code.
 *
 * @example
 * ```ts
 * import express from "express";
 * import { errorHandler } from "./middlewares/errorHandler";
 * import { routes } from "./routes";
 *
 * const app = express();
 *
 * app.use("/api", routes);
 *
 * // Must be the last middleware
 * app.use(errorHandler);
 *
 * app.listen(3000, () => console.log("Server running on port 3000"));
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
}