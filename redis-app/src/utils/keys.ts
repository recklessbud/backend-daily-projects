//bites: restaurant: 53

export function getKeyName(...args: string[]) {
    return `bites: ${args.join(':')}`
}

export const restaurantKeyById = (id: string) => getKeyName('restaurants', id);
export const reviewKeyById = (id: string) => getKeyName('reviews', id);
export const reviewDetailsById = (id: string) => getKeyName('review_details', id);