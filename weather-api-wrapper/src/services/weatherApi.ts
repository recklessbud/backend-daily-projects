import { Request, Response, NextFunction } from "express";
import { envVariables } from "../config/dotenv.config";
import { cache } from "../cache/cache";
import { errorResponse, sucessResponse } from "../utils/Responses.util";


export const getCityWeather = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {city} = req.body
    try {
        if(!city || city.trim() === ""){
            errorResponse(res, 404, "City is required");
            return;
        }
        const results = await cache(city);
         if(!results || results.length === 0 ){
            errorResponse(res, 404, "City not found");
            return;
         }
        sucessResponse(res, 200, results);
        return;
    } catch (error) {
        console.log(error);
        // return;
        throw new Error("error fetching weather");
        
        
    }
}