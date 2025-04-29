import { Request, Response, NextFunction } from "express";
import { envVariables } from "../config/dotenv.config";
import { cache } from "../cache/cache";
import { errorResponse, sucessResponse } from "../utils/Responses.util";


export const getCityWeather = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {city} = req.body
    try {
        if(!city){
            errorResponse(res, 400, "City is required");
        }
        const results = await cache(city);
         if(!results){
            errorResponse(res, 404, "City not found");
         }
        sucessResponse(res, 200, results);
    } catch (error) {
        console.log(error);
        throw new Error("error fetching weather");
        
    }
}