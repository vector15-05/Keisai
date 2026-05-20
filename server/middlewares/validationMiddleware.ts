import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodSchema} from 'zod';
import { BadRequestError } from "../errors/appErrors";
export const validate = (schema: ZodSchema<any>) => {
    return async( req: Request, res:Response, next: NextFunction ) => {
        try{

            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            }) as any;

            req.body = parsed.body;
            req.query = parsed.query;
            req.params = parsed.params;

            return next();

        } catch(err){
            if(err instanceof ZodError){
                return next(new BadRequestError(err.message));
            }
            return next(err as Error);
        }
    }
}