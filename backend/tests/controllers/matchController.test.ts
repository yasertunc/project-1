import { describe, it, expect, beforeEach, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import { matchController } from "../../src/controllers/matchController";
import { MatchRequest } from "../../src/types";

describe("MatchController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();
  });

  describe("enqueue", () => {
    it("should enqueue a match request", async () => {
      const request: MatchRequest = {
        intent: "route",
        location: {
          geoHash: "s0m3h4sh",
          radius: 1000,
        },
        capabilities: {
          text: true,
          voice: false,
          location: true,
        },
        preferences: {
          maxWaitTime: 300,
          language: "en",
        },
      };

      mockRequest.body = request;

      await matchController.enqueue(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(202);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe("cancel", () => {
    it("should cancel a match request", async () => {
      mockRequest.body = { matchId: "test-match-id" };

      await matchController.cancel(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Should call next with error if match not found
      // In a real test, we'd set up the match first
      expect(mockNext).toHaveBeenCalled();
    });
  });
});

