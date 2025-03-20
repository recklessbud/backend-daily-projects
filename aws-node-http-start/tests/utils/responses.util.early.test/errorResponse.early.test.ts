
import { Response } from "express";
import { errorResponse } from '../../../src/utils/responses.util';




describe('errorResponse() errorResponse method', () => {
  let mockResponse: Response;

  beforeEach(() => {
    // Mocking the Response object from Express
    mockResponse = {
      status: jest.fn().mockReturnThis(), 
    } as unknown as Response;
  });

  describe('Happy Paths', () => {
    it('should set the status of the response to 200', () => {
      // Test to ensure the function sets the status to 200
      errorResponse(mockResponse, 200);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should set the status of the response to 404', () => {
      // Test to ensure the function sets the status to 404
      errorResponse(mockResponse, 404);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it('should set the status of the response to 500', () => {
      // Test to ensure the function sets the status to 500
      errorResponse(mockResponse, 500);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative status codes gracefully', () => {
      // Test to ensure the function handles negative status codes
      errorResponse(mockResponse, -1);
      expect(mockResponse.status).toHaveBeenCalledWith(-1);
    });

    it('should handle zero as a status code', () => {
      // Test to ensure the function handles zero as a status code
      errorResponse(mockResponse, 0);
      expect(mockResponse.status).toHaveBeenCalledWith(0);
    });

    it('should handle very large status codes', () => {
      // Test to ensure the function handles very large status codes
      errorResponse(mockResponse, 9999);
      expect(mockResponse.status).toHaveBeenCalledWith(9999);
    });

    it('should handle non-integer status codes', () => {
      // Test to ensure the function handles non-integer status codes
      errorResponse(mockResponse, 200.5);
      expect(mockResponse.status).toHaveBeenCalledWith(200.5);
    });
  });
});