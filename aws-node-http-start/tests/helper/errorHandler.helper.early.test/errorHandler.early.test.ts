
import { NextFunction, Request, Response } from "express";
import { errorHandler } from '../../../src/helper/errorHandler.helper';
import { errorResponse } from "../../../src/utils/responses.util";



// Import necessary modules and functions


// Import necessary modules and functions
// Mock the errorResponse function from the responses.util module
jest.mock("../../../src/utils/responses.util", () => {
  const actual = jest.requireActual("../../../src/utils/responses.util");
  return {
    ...actual,
    errorResponse: jest.fn(),
  };
});

// Mock the express Request, Response, and NextFunction
const mockRequest = {} as Request;
const mockResponse = {
  json: jest.fn(),
} as unknown as Response;
const mockNextFunction = jest.fn() as NextFunction;

describe('errorHandler() errorHandler method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy paths', () => {
    it('should call next function when error is not a SyntaxError', () => {
      // Arrange: Create a generic error
      const error = new Error('Generic error');

      // Act: Call the errorHandler
      errorHandler(error, mockRequest, mockResponse, mockNextFunction);

      // Assert: Ensure next function is called
      expect(mockNextFunction).toHaveBeenCalled();
      expect(errorResponse).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should respond with 400 and "Invalid JSON" message when error is a SyntaxError with body', () => {
      // Arrange: Create a SyntaxError with a body property
      const error = new SyntaxError('Unexpected token');
      (error as any).body = true;

      // Act: Call the errorHandler
      errorHandler(error, mockRequest, mockResponse, mockNextFunction);

      // Assert: Ensure errorResponse is called with 400 and correct message
      expect(errorResponse).toHaveBeenCalledWith(mockResponse, 400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid JSON' });
      expect(mockNextFunction).not.toHaveBeenCalled();
    });

    it('should call next function when error is a SyntaxError without body', () => {
      // Arrange: Create a SyntaxError without a body property
      const error = new SyntaxError('Unexpected token');

      // Act: Call the errorHandler
      errorHandler(error, mockRequest, mockResponse, mockNextFunction);

      // Assert: Ensure next function is called
      expect(mockNextFunction).toHaveBeenCalled();
      expect(errorResponse).not.toHaveBeenCalled();
    });
  });
});