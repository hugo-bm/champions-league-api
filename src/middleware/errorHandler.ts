import { Request, Response } from 'express';
import HttpError from '../errors/HttpError';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function errorHandler (err: any, req: Request, res: Response){
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({error: err.message});
    }
    console.error(err);
    return res.status(500).json({error: "Internal server error"})
}