import puppeteer from "puppeteer-core";
import * as cheerio from "cheerio";
import  Chromium  from "chrome-aws-lambda";
import { CHROME_PATH, NODE_ENV } from "../config/env.config";
import { fileOps } from "../utils/fileOps.utils";
// import { mkdir, rm } from "fs/promises";
// import { rm, writeFileSync } from "fs";
// import { fileOps } from "../utils/fileOps.utils";

interface ScrapedProduct {
    title: string;
    price: string;
    image?: string;
    url: string;
}

export const scrape = async (url: string): Promise<ScrapedProduct[] | undefined> => {
    try {
        const executablePath = NODE_ENV === "production" ? await Chromium.executablePath
        : CHROME_PATH

        const browser = await puppeteer.launch({
            args: [...Chromium.args, '--no-sandbox'],
            executablePath: executablePath,
            headless: Chromium.headless,
            defaultViewport: Chromium.defaultViewport,
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        const html = await page.content(); 
        const $ = cheerio.load(html);
        
        const products: ScrapedProduct[] = [];

        // Example selectors - adjust these based on the target website
        $('.product_pod').each((_, element) => {
            const title = $(element).find('h3 a').attr('title') || '';
            const price = $(element).find('.price_color').text() || '';
            const image = $(element).find('img').attr('src') || '';
            const productUrl = $(element).find('h3 a').attr('href') || '';

            products.push({
                title: title.trim(),
                price: price.trim(),
                image: image ? new URL(image, url).toString() : undefined,
                url: productUrl ? new URL(productUrl, url).toString() : url
            });
        });  
        
        await fileOps.saveData(products)
        await browser.close();        

        return products

    } catch (error) {
        console.error('Scraping error:', error);
        // throw new Error(`Failed to scrape URL: ${url}`);
        // return undefined;
       
        // return await fileOps.readData()
    }
}

