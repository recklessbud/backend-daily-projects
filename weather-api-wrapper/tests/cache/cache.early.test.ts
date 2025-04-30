import { cache } from "../../src/cache/cache";
import redis from "../../src/config/redis.config";
import { getWeather } from "../../src/api/weather.api";
import { envVariables } from "../../src/config/dotenv.config";

// src/cache/cache.test.ts

jest.mock("../../src/config/redis.config");
jest.mock("../../src/api/weather.api");

describe("cache", () => {
  const mockCity = "London";
  const mockWeatherKey = `city: ${mockCity.toLowerCase()}`;
  const mockWeatherData = { weather: [{ main: "Clear" }], name: "London" };
  const mockCacheTTL = 3600;

  beforeEach(() => {
    jest.clearAllMocks();
    (envVariables as any).CACHE_TTL = mockCacheTTL;
  });

  it("should return cached data if it exists in Redis", async () => {
    (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(mockWeatherData));

    const result = await cache(mockCity);

    expect(redis.get).toHaveBeenCalledWith(mockWeatherKey);
    expect(JSON.stringify(result)).toEqual(JSON.stringify(mockWeatherData));
    expect(getWeather).not.toHaveBeenCalled();
    expect(redis.set).not.toHaveBeenCalled();
  });

  it("should fetch weather data and store it in Redis if it doesn't exist in Redis", async () => {
    (redis.get as jest.Mock).mockResolvedValue(null);
    (getWeather as jest.Mock).mockResolvedValue(mockWeatherData);

    const result = await cache(mockCity);

    expect(redis.get).toHaveBeenCalledWith(mockWeatherKey);
    expect(getWeather).toHaveBeenCalledWith(mockCity);
    expect(redis.set).toHaveBeenCalledWith(
      mockWeatherKey,
      JSON.stringify(mockWeatherData),
      "EX",
      mockCacheTTL
    );
    expect(result).toEqual(mockWeatherData);
  });

  it("should handle errors when fetching weather data", async () => {
    (redis.get as jest.Mock).mockResolvedValue(null);
    (getWeather as jest.Mock).mockRejectedValue(new Error("Failed to fetch weather data"));

    await expect(cache(mockCity)).rejects.toThrow("Error caching data");

    expect(redis.get).toHaveBeenCalledWith(mockWeatherKey);
    expect(getWeather).toHaveBeenCalledWith(mockCity);
    expect(redis.set).not.toHaveBeenCalled();
  });

  it("should handle errors when interacting with Redis", async () => {
    (redis.get as jest.Mock).mockRejectedValue(new Error("Redis error"));

    await expect(cache(mockCity)).rejects.toThrow("Error caching data");

    expect(redis.get).toHaveBeenCalledWith(mockWeatherKey);
    expect(getWeather).not.toHaveBeenCalled();
    expect(redis.set).not.toHaveBeenCalled();
  });

  it("should handle empty city name", async () => {
    const emptyCity = "";
    const emptyWeatherKey = `city: ${emptyCity.toLowerCase()}`;
    const mockEmptyWeatherData = { weather: [{ main: "Clear" }], name: "" };

    (redis.get as jest.Mock).mockResolvedValue(null);
    (getWeather as jest.Mock).mockResolvedValue(mockEmptyWeatherData);

    await cache(emptyCity);

    expect(redis.get).toHaveBeenCalledWith(emptyWeatherKey);
    expect(getWeather).toHaveBeenCalledWith(emptyCity);
    expect(redis.set).toHaveBeenCalledWith(
      emptyWeatherKey,
      JSON.stringify(mockEmptyWeatherData),
      "EX",
      mockCacheTTL
    );
  });
 });
