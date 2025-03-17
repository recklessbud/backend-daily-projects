import { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../utils/responses.util";
import { count } from "console";


const dummyProducts = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        url: "https://www.amazon.com/iphone-15-pro",
        price: 999.99,
        rating: 4.5,
        store: "Amazon",
        lastUpdated: new Date().toISOString()
    },
    {
        id: 2,
        name: "Samsung Galaxy S24",
        url: "https://www.amazon.com/samsung-s24",
        price: 899.99,
        rating: 4.3,
        store: "Best Buy",
        lastUpdated: new Date().toISOString()
    },
    {
        id: 3,
        name: "Google Pixel 7",
        url: "https://www.amazon.com/google-pixel-7",
        price: 799.99,
        rating: 4.2,
        store: "Amazon",
        lastUpdated: new Date().toISOString()
    }, 
    {
        id: 4,
        name: "Samsung Galaxy S23",	
        url: "https://www.amazon.com/samsung-s23",
        price: 699.99,
        rating: 3.3,
        store: "Best Buy",
        lastUpdated: new Date().toISOString()
    },
    {
        id: 5,
        name: "Samsung Galaxy S22",
        url: "https://www.amazon.com/samsung-s24",
        price: 899.99,
        rating: 4.3,
        store: "Best Buy",
        lastUpdated: new Date().toISOString()
    },
];

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
    await new Promise(resolve => setTimeout(resolve, 500));

    //filter the products
    const results = dummyProducts.filter(product=>
        //go through each product to check if it contains the search item
        product.name.toLowerCase().includes(String(searchItem).toString().toLowerCase()) ||
        product.url.toLowerCase().includes(String(searchItem).toString().toLowerCase())
    )
    //if found return the product 
    successResponse(res, 200).json({ results: results, success: true, count: results.length });
   } catch (error) {
    console.error('View rendering error:', error);  
    next(error)
   }
    
}