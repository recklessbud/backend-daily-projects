import { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../utils/responses.util";
import { count } from "console";
import  {scrape}  from "../helper/scrape.helper";
// import { fileOps } from "../utils/fileOps.utils";
import path from 'path';
import os from 'os';
import { fileOps } from "../utils/fileOps.utils";
import { baseUrl } from "../config/env.config";


// export const scrapeUrl = scrape('https://books.toscrape.com/');
export const searchProducts = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { 
     //set a 500ms delay
     
    //get the item from the query
    const { searchItem, useCache } = req.query;
    
    //check availability of the product
    if (!searchItem) {
        //return error if not found
        errorResponse(res, 400).json({ error: 'Search item is required', success: false });
       return
    } 

    
        // Format search term for URL
    const formattedSearch = String(searchItem)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    const scrapeUrl = `${baseUrl}/catalogue/${formattedSearch}/index.html`;

  
    let products = await scrape(scrapeUrl);
    if(!products || products.length === 0) {
        products = await scrape(`${baseUrl}/catalogue/category/books/${formattedSearch}_${formattedSearch}/index.html`)
    }
    
    if (!products || products.length === 0) {
        products = await scrape(`${baseUrl}/catalogue/page-1.html`);
        // Filter results after scraping
        products = products?.filter((product: { title: string; }) =>
            product.title.toLowerCase().includes(String(searchItem).toLowerCase())
        );
    }
    if (products && products.length > 0) {
        await fileOps.saveData(products);
        return
    }
    // await new Promise(resolve => setTimeout(resolve, 5000));



     //set a 500ms delay
    
    //if found return  the product 
    successResponse(res, 200).json({ results: products || [], success: true, count: products?.length || 0, fromCache: useCache === 'true'});
   } catch (error) {
    console.error('View rendering error:', error);  
    const { searchItem } = req.query;
    try {
        const cachedProducts = await fileOps.readData();
        const filteredResults = cachedProducts.filter((product: { title: string; }) =>
            product.title.toLowerCase().includes(String(searchItem).toLowerCase())
        );
        
        successResponse(res, 200).json({ 
            results: filteredResults, 
            success: true, 
            count: filteredResults.length,
            fromCache: true
        });
    } catch (cacheError) {
        errorResponse(res, 500).json({ 
            error: 'Failed to retrieve products', 
            success: false 
        });
    }
}
   }
    
