//bites: restaurant: 53

export function getKeyName(...args: string[]) {
    return `bites: ${args.join(':')}`
}

export const restaurantKeyById = (id: string) => getKeyName('restaurants', id);
export const reviewKeyById = (id: string) => getKeyName('reviews', id);
export const reviewDetailsById = (id: string) => getKeyName('review_details', id);

export const cuisinesKey =  getKeyName('cuisines');
export const cuisineKeyById = (name: string) => getKeyName('cuisines', name);
export const restaurantCuisine = (id: string) => getKeyName('restaurant_cuisines', id);

export const restaurantsByRatingScore = getKeyName("restaurants_by_rating")
export const weatherKeyById = (id: string) => getKeyName('weather', id);
export const restaurantDetailsById = (id: string) => getKeyName('restaurant_details', id);