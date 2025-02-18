import {z} from 'zod'


export const ValidateRestaurantSchema = z.object({
 name: z.string().min(2),
 location: z.string().min(2),
 cuisines: z.array(z.string()).min(1)
});


export const ValidateRestaurantDetails = z.object({
    links: z.array(z.object({
        name: z.string().min(2),
        url: z.string().url()
    })),
    contact: z.object({
        email: z.string().email(),
        phone: z.string(),        
    })
})

export const Review = z.object({
    review: z.string().min(2),
    ratings: z.number().min(1).max(5)
})


export type RestaurantSchema = z.infer<typeof ValidateRestaurantSchema>;
export type RestaurantDetailsSchema = z.infer<typeof ValidateRestaurantDetails>;
export type ReviewSchema = z.infer<typeof Review>; 