/**
 * E2E Test Data Fixtures
 *
 * Reusable test data for E2E tests
 */

export const testUsers = {
  valid: {
    name: "Test User",
    email: "test@example.com",
    age: 25,
    interests: ["technology", "music"],
  },
  invalid: {
    name: "",
    email: "invalid-email",
    age: -1,
  },
};

export const matchingFlowData = {
  enqueue: {
    userId: "user-123",
    preferences: {
      language: "en",
      ageRange: [18, 35],
      interests: ["technology"],
    },
  },
  success: {
    matchId: "match-456",
    partnerId: "user-789",
    channelId: "channel-abc",
  },
  cancel: {
    matchId: "match-456",
  },
};

export const apiResponses = {
  success: {
    status: 200,
    data: { success: true },
  },
  badRequest: {
    status: 400,
    error: "Bad Request",
    message: "Invalid request parameters",
  },
  unauthorized: {
    status: 401,
    error: "Unauthorized",
    message: "Authentication required",
  },
  notFound: {
    status: 404,
    error: "Not Found",
    message: "Resource not found",
  },
  rateLimit: {
    status: 429,
    error: "Too Many Requests",
    message: "Rate limit exceeded",
    retryAfter: 60,
  },
  serverError: {
    status: 500,
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  },
  serviceUnavailable: {
    status: 503,
    error: "Service Unavailable",
    message: "Service temporarily unavailable",
  },
};

export const notificationData = {
  token: "test-push-token-123",
  permission: "granted",
  denied: "denied",
};

export const profileData = {
  complete: {
    name: "John Doe",
    age: 30,
    bio: "Test bio",
    interests: ["technology", "music", "travel"],
    preferences: {
      language: "en",
      notifications: true,
    },
  },
  incomplete: {
    name: "Jane",
    age: 25,
  },
};
