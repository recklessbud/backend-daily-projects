import { NextFunction, Request, Response } from "express";
import { cache } from "../../src/cache/cache";
import { errorResponse, sucessResponse } from "../../src/utils/Responses.util";
import { getCityWeather } from "../../src/services/weatherApi";

// src/services/__tests__/weatherApi.getCityWeather.spec.ts

// src/services/__tests__/weatherApi.getCityWeather.spec.ts
// Mocking errorResponse and sucessResponse from ../utils/Responses.util
jest.mock("../../src/utils/Responses.util", () => {
  const actual = jest.requireActual("../../src/utils/Responses.util");
  return {
    __esModule: true,
    ...actual,
    errorResponse: jest.fn(),
    sucessResponse: jest.fn(),
  };
});

// Mocking cache from ../cache/cache
jest.mock("../../src/cache/cache", () => {
  const actual = jest.requireActual("../../src/cache/cache");
  return {
    __esModule: true,
    ...actual,
    cache: jest.fn(),
  };
});
describe("getCityWeather() getCityWeather method", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {},
    } as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response;

    next = jest.fn();
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe("Happy paths", () => {
    it("should return weather data for a valid city", async () => {
      // This test ensures that when a valid city is provided and cache returns data, the success response is sent.
      req.body = { city: "London" };
      (cache as jest.MockedFunction<typeof cache>).mockResolvedValueOnce({
        temp: 20,
        city: "London",
      });

      await getCityWeather(req, res, next);

      expect(cache).toHaveBeenCalledWith("London");
      expect(sucessResponse).toHaveBeenCalledWith(res, 200, {
        temp: 20,
        city: "London",
      });
      expect(errorResponse).not.toHaveBeenCalled();
    });

    it("should handle city names with special characters", async () => {
      // This test ensures that city names with special characters are handled correctly.
      req.body = { city: "São Paulo" };
      (cache as jest.MockedFunction<typeof cache>).mockResolvedValueOnce({
        temp: 25,
        city: "São Paulo",
      });

      await getCityWeather(req, res, next);

      expect(cache).toHaveBeenCalledWith("São Paulo");
      expect(sucessResponse).toHaveBeenCalledWith(res, 200, {
        temp: 25,
        city: "São Paulo",
      });
      expect(errorResponse).not.toHaveBeenCalled();
    });

    it("should handle city names with leading/trailing spaces", async () => {
      // This test ensures that city names with spaces are passed as-is to cache.
      req.body = { city: "  Paris  " };
      (cache as jest.MockedFunction<typeof cache>).mockResolvedValueOnce({
        temp: 18,
        city: "  Paris  ",
      });

      await getCityWeather(req, res, next);

      expect(cache).toHaveBeenCalledWith("  Paris  ");
      expect(sucessResponse).toHaveBeenCalledWith(res, 200, {
        temp: 18,
        city: "  Paris  ",
      });
      expect(errorResponse).not.toHaveBeenCalled();
    });
  });

  // Edge Case Tests
  describe("Edge cases", () => {
    it("should return 404 if city is missing in request body", async () => {
      // This test ensures that if city is not provided, a 400 error is returned.
      req.body = {};

      await getCityWeather(req, res, next);

      expect(errorResponse).toHaveBeenCalledWith(res, 404, "City is required");
      expect(cache).not.toHaveBeenCalled();
      expect(sucessResponse).not.toHaveBeenCalled();
    });

    it("should return 404 if city is not found in cache", async () => {
      // This test ensures that if cache returns a falsy value, a 404 error is returned.
      req.body = { city: "Atlantis" };
      (cache as jest.MockedFunction<typeof cache>).mockResolvedValueOnce(
        undefined
      );

      await getCityWeather(req, res, next);

      expect(cache).toHaveBeenCalledWith("Atlantis");
      expect(errorResponse).toHaveBeenCalledWith(res, 404, "City not found");
      expect(sucessResponse).not.toHaveBeenCalled();
    });

    it("should throw an error if cache throws an exception", async () => {
      // This test ensures that if cache throws, the function throws an error with the correct message.
      req.body = { city: "Tokyo" };
      (cache as jest.MockedFunction<typeof cache>).mockRejectedValueOnce(
        new Error("Redis error")
      );

      await expect(getCityWeather(req, res, next)).rejects.toThrow(
        "error fetching weather"
      );

      expect(cache).toHaveBeenCalledWith("Tokyo");
      expect(errorResponse).not.toHaveBeenCalled();
      expect(sucessResponse).not.toHaveBeenCalled();
    });

    it("should not call sucessResponse or cache if city is an empty string", async () => {
      // This test ensures that an empty string for city is treated as missing and returns 400.
      req.body = { city: "" };

      await getCityWeather(req, res, next);

      expect(errorResponse).toHaveBeenCalledWith(res, 404, "City is required");
      expect(cache).not.toHaveBeenCalled();
      expect(sucessResponse).not.toHaveBeenCalled();
    });
  });

  describe("More edge cases", () => {
    it("should handle null city", async () => {
      req.body = { city: null };

      await getCityWeather(req, res, next);

      expect(errorResponse).toHaveBeenCalledWith(res, 404, "City is required");
      expect(cache).not.toHaveBeenCalled();
      expect(sucessResponse).not.toHaveBeenCalled();
    });

    it("should handle undefined city", async () => {
      req.body = { city: undefined };

      await getCityWeather(req, res, next);

      expect(errorResponse).toHaveBeenCalledWith(res, 404, "City is required");
      expect(cache).not.toHaveBeenCalled();
      expect(sucessResponse).not.toHaveBeenCalled();
    });
  });
});
