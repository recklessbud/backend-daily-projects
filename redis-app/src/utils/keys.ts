//bites: restaurant: 53

export function getKeyName(...args: string[]) {
    return `bites: ${args.join(':')}`
}

export const restaurantKeyById = (id: string) => getKeyName('restaurants', id);