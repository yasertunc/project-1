# Backend API Design

This document outlines the backend API endpoints, flows, and data contracts for the Fellowus matching service.

## Overview

The Fellowus backend provides a RESTful API for anonymous matching and conversation management. The API is designed to be privacy-first, supporting ephemeral conversations without exposing user identities.

## Base URL

- **Production**: `https://api.fellowus.com`
- **Staging**: `https://staging-api.fellowus.com`
- **Development**: `http://localhost:3000`

## Authentication

Currently, the API supports optional Bearer token authentication for future user accounts. For anonymous matching (v1), authentication is optional.

```http
Authorization: Bearer <token>
```

## API Endpoints

### 1. Enqueue Match Request

**POST** `/v1/match/enqueue`

Initiates a matching request. The user is added to a queue and matched with compatible users based on intent, location, and preferences.

**Request Body:**
```json
{
  "intent": "route" | "incident" | "social" | "coach",
  "location": {
    "geoHash": "string",  // Geohash with limited precision
    "radius": number      // Radius in meters
  },
  "capabilities": {
    "text": boolean,
    "voice": boolean,
    "location": boolean
  },
  "preferences": {
    "maxWaitTime": number,  // Maximum wait time in seconds
    "language": "en" | "tr" | "ar"
  }
}
```

**Response:** `202 Accepted`
```json
{
  "matchId": "string",
  "queuePosition": number,
  "estimatedWaitTime": number
}
```

**Error Responses:**
- `400 Bad Request` - Invalid request body
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### 2. Cancel Match Request

**POST** `/v1/match/cancel`

Cancels an active matching request.

**Request Body:**
```json
{
  "matchId": "string"
}
```

**Response:** `204 No Content`

**Error Responses:**
- `404 Not Found` - Match ID not found
- `409 Conflict` - Match already completed or cancelled

### 3. Match Status

**GET** `/v1/match/{matchId}/status`

Retrieves the current status of a match request.

**Response:** `200 OK`
```json
{
  "matchId": "string",
  "status": "queued" | "matched" | "cancelled" | "expired",
  "queuePosition": number | null,
  "matchedAt": "ISO8601" | null,
  "participants": [
    {
      "handle": "string",
      "capabilities": {
        "text": boolean,
        "voice": boolean,
        "location": boolean
      }
    }
  ] | null
}
```

### 4. Send Offer

**POST** `/v1/match/offer`

Sends a matching offer to a user. This is typically called by the backend when a compatible match is found.

**Request Body:**
```json
{
  "matchId": "string",
  "participants": [
    {
      "handle": "string",
      "score": number,
      "capabilities": {
        "text": boolean,
        "voice": boolean,
        "location": boolean
      }
    }
  ],
  "score": {
    "total": number,
    "intent": number,
    "location": number,
    "capabilities": number
  }
}
```

**Response:** `200 OK`
```json
{
  "offerId": "string",
  "expiresAt": "ISO8601"
}
```

### 5. Accept/Decline Offer

**POST** `/v1/match/offer/{offerId}/accept`
**POST** `/v1/match/offer/{offerId}/decline`

Accepts or declines a matching offer.

**Response:** `200 OK`
```json
{
  "status": "accepted" | "declined",
  "channelId": "string" | null  // Only if accepted
}
```

### 6. Open Channel

**POST** `/v1/channel/{channelId}/open`

Opens a communication channel between matched users.

**Response:** `200 OK`
```json
{
  "channelId": "string",
  "participants": [
    {
      "handle": "string",
      "capabilities": {
        "text": boolean,
        "voice": boolean,
        "location": boolean
      }
    }
  ],
  "expiresAt": "ISO8601"
}
```

### 7. Send Message

**POST** `/v1/channel/{channelId}/messages`

Sends a message in a channel.

**Request Body:**
```json
{
  "text": "string",
  "type": "text" | "voice" | "location"
}
```

**Response:** `201 Created`
```json
{
  "messageId": "string",
  "timestamp": "ISO8601"
}
```

### 8. Get Messages

**GET** `/v1/channel/{channelId}/messages`

Retrieves messages from a channel.

**Query Parameters:**
- `limit` (optional): Number of messages to retrieve (default: 50, max: 100)
- `before` (optional): Message ID to retrieve messages before

**Response:** `200 OK`
```json
{
  "messages": [
    {
      "messageId": "string",
      "from": "string",  // Handle
      "text": "string",
      "type": "text" | "voice" | "location",
      "timestamp": "ISO8601"
    }
  ],
  "hasMore": boolean
}
```

### 9. Close Channel

**POST** `/v1/channel/{channelId}/close`

Closes a communication channel.

**Response:** `204 No Content`

### 10. Report User

**POST** `/v1/report`

Reports a user for inappropriate behavior.

**Request Body:**
```json
{
  "channelId": "string",
  "reportedHandle": "string",
  "reason": "spam" | "harassment" | "inappropriate" | "other",
  "description": "string"  // Optional
}
```

**Response:** `201 Created`
```json
{
  "reportId": "string"
}
```

## WebSocket Events

For real-time updates, the API supports WebSocket connections at `/v1/ws`.

### Client → Server Events

- `enqueue` - Enqueue a match request
- `cancel` - Cancel a match request
- `accept_offer` - Accept a matching offer
- `decline_offer` - Decline a matching offer
- `send_message` - Send a message in a channel
- `close_channel` - Close a channel

### Server → Client Events

- `queue_update` - Queue position update
- `offer_received` - New matching offer
- `offer_timeout` - Offer expired
- `match_found` - Match found (offer accepted)
- `match_declined` - Match declined
- `channel_opened` - Channel opened
- `message_received` - New message in channel
- `channel_closed` - Channel closed
- `error` - Error occurred

## Push Notifications

The backend sends push notifications for:
- Matching offers
- New messages
- Channel opened/closed
- Match status updates

Push tokens are registered via the mobile app's `registerPushToken` service.

## Rate Limiting

- **Enqueue**: 10 requests per minute per IP
- **Messages**: 60 messages per minute per channel
- **Reports**: 5 reports per hour per IP

Rate limit headers:
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1638360000
```

## Error Handling

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}  // Optional additional details
  }
}
```

Common error codes:
- `INVALID_REQUEST` - Invalid request body or parameters
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT_EXCEEDED` - Rate limit exceeded
- `MATCH_EXPIRED` - Match request expired
- `CHANNEL_CLOSED` - Channel is closed
- `UNAUTHORIZED` - Authentication required
- `INTERNAL_ERROR` - Server error

## Data Privacy

- User handles are randomly generated and not linked to real identities
- Location data uses geohash with limited precision (privacy-preserving)
- Messages are ephemeral and deleted after channel closure
- No PII is stored or transmitted

## Implementation Status

- ✅ OpenAPI specification (`openapi/matching.yaml`)
- ✅ TypeScript client (`src/api/matchingClient.ts`)
- ✅ Mock implementation for Storybook (`src/mocks/matchingMock.ts`)
- ⚠️ Backend implementation (pending)
- ⚠️ WebSocket support (pending)
- ⚠️ Push notification integration (pending)

## Next Steps

1. Implement backend API endpoints
2. Set up WebSocket server
3. Integrate push notification service (FCM/APNs)
4. Implement rate limiting middleware
5. Set up monitoring and logging
6. Deploy to staging environment
7. Load testing and optimization

