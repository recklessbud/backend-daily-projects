import axios from "axios";
import { envVariables } from "../../src/config/dotenv.config";
import { getWeather } from "../../src/api/weather.api"
// src/api/__tests__/weather.api.test.ts

// src/api/__tests__/weather.api.test.ts
jest.mock("axios");
jest.mock("axios-retry", () => jest.fn());

describe("getWeather() getWeather method", () => {
  const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
  const WEATHER_API_KEY = "dd752b9a386bcdd83cb1fa72e8aa70df";

  beforeAll(() => {
    // Set up envVariables mock values
    (envVariables as any).WEATHER_API_BASE_URL = WEATHER_API_BASE_URL;
    (envVariables as any).WEATHER_API_KEY = WEATHER_API_KEY;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe("Happy paths", () => {
    it("should fetch weather data successfully for a valid city", async () => {
      // This test ensures that getWeather returns the correct data when axios resolves successfully.
      const mockCity = "London";
      const mockData = { weather: [{ main: "Clear" }], name: "London" };
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

      const result = await getWeather(mockCity);

      expect(axios.get).toHaveBeenCalledWith(
        `${WEATHER_API_BASE_URL}?q=${mockCity}&appid=${WEATHER_API_KEY}`
      );
      expect(result).toEqual(mockData);
    });

    it("should handle city names with spaces and special characters", async () => {
      // This test ensures that city names with spaces or special characters are handled correctly.
      const mockCity = "New York"; 
      const mockData = { weather: [{ main: "Clouds" }], name: "New York" };
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

      const result = await getWeather(mockCity);

      expect(axios.get).toHaveBeenCalledWith(
        `${WEATHER_API_BASE_URL}?q=${mockCity}&appid=${WEATHER_API_KEY}`
      );
      expect(result).toEqual(mockData);
    });

    it("should work with numeric city names", async () => {
      // This test ensures that numeric city names are handled as strings and passed correctly.
      const mockCity = "12345";
      const mockData = { weather: [{ main: "Rain" }], name: "12345" };
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

      const result = await getWeather(mockCity);

      expect(axios.get).toHaveBeenCalledWith(
        `${WEATHER_API_BASE_URL}?q=${mockCity}&appid=${WEATHER_API_KEY}`
      );
      expect(result).toEqual(mockData);
    });
  });

  // Edge Case Tests
  describe("Edge cases", () => {
    it("should throw an error if axios.get throws an error", async () => {
      // This test ensures that getWeather throws the correct error message when axios fails.
      const mockCity = "InvalidCity";
      const mockError = new Error("Network Error");
      (axios.get as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(getWeather(mockCity)).rejects.toThrow(
        "error counld not fetch weather"
      );
      expect(axios.get).toHaveBeenCalledWith(
        `${WEATHER_API_BASE_URL}?q=${mockCity}&appid=${WEATHER_API_KEY}`
      );
    });

    it("should handle empty string as city name", async () => {
      // This test ensures that an empty city name is still passed to the API and handled.
      const mockCity = "";
      const mockData = { weather: [{ main: "Clear" }], name: "" };
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

      const result = await getWeather(mockCity);

      expect(axios.get).toHaveBeenCalledWith(
        `${WEATHER_API_BASE_URL}?q=${mockCity}&appid=${WEATHER_API_KEY}`
      );
      expect(result).toEqual(mockData);
    });

    it("should throw the correct error if axios.get throws a non-Error object", async () => {
      // This test ensures that getWeather still throws the correct error message if axios throws a string or other non-Error object.
      const mockCity = "Paris";
      (axios.get as jest.Mock).mockRejectedValueOnce("Some error string");

      await expect(getWeather(mockCity)).rejects.toThrow(
        "error counld not fetch weather"
      );
      expect(axios.get).toHaveBeenCalledWith(
        `${WEATHER_API_BASE_URL}?q=${mockCity}&appid=${WEATHER_API_KEY}`
      );
    });

    it("should handle city names with unicode characters", async () => {
      // This test ensures that city names with unicode characters are handled correctly.
      const mockCity = "München";
      const mockData = { weather: [{ main: "Sunny" }], name: "München" };
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

      const result = await getWeather(mockCity);

      expect(axios.get).toHaveBeenCalledWith(
        `${WEATHER_API_BASE_URL}?q=${mockCity}&appid=${WEATHER_API_KEY}`
      );
      expect(result).toEqual(mockData);
    });
  });
});
