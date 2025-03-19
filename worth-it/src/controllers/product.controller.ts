import { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../utils/responses.util";
import { count } from "console";
import  {scrape}  from "../helper/scrape.helper";
import { fileOps } from "../utils/fileOps.utils";
import path from 'path';
import os from 'os';


export const CHROME_TEMP_DIR = path.join(os.tmpdir(), `chrome-scraper-${process.pid}`);
export const scrapeUrl = 'https://books.toscrape.com'
export const searchProducts = async(req: Request, res: Response, next: NextFunction) => {
    try { 
    //get the item from the query
    const { searchItem } = req.query;

    //check availability of the product
    if (!searchItem) {
        //return error if not found
        errorResponse(res, 400).json({ error: 'Search item is required', success: false });
    } 

    //set a 500ms delay
    await new Promise(resolve => setTimeout(resolve, 5000));
    await scrape(scrapeUrl, CHROME_TEMP_DIR);

    const products = await fileOps.readData();

    //filter the products   
    const filteredResults = products.filter((product: { title: string; }) =>
        product.title.toLowerCase().includes(String(searchItem).toLowerCase())
    )
    console.log(filteredResults)  
    //if found return  the product 
    successResponse(res, 200).json({ results: filteredResults, success: true, count: filteredResults.length});
   } catch (error) {
    console.error('View rendering error:', error);  
    next(error)
   }
    
}