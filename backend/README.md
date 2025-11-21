# Fellowus Backend API

Backend API for the Fellowus matching service.

## Features

- ✅ REST API endpoints (match, channel, report, push)
- ✅ WebSocket server for real-time updates
- ✅ Matching engine with scoring algorithm
- ✅ Queue management
- ✅ Push notifications (Firebase FCM)
- ✅ Rate limiting
- ✅ Request validation
- ✅ Error handling

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=3000
NODE_ENV=development

FIREBASE_PROJECT_ID=fellowus-4ceb8
FIREBASE_SERVICE_ACCOUNT_KEY=path/to/service-account-key.json

RATE_LIMIT_ENQUEUE=10
RATE_LIMIT_MESSAGES=60
RATE_LIMIT_REPORTS=5

MATCH_TIMEOUT=300000
MAX_QUEUE_SIZE=1000
CHANNEL_EXPIRATION=86400000
```

### Development

```bash
npm run dev
```

Server will start on `http://localhost:3000`

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## API Endpoints

### Match

- `POST /v1/match/enqueue` - Enqueue a match request
- `POST /v1/match/cancel` - Cancel a match request
- `GET /v1/match/:matchId/status` - Get match status
- `POST /v1/match/offer` - Send a match offer
- `POST /v1/match/offer/:offerId/accept` - Accept an offer
- `POST /v1/match/offer/:offerId/decline` - Decline an offer
- `POST /v1/match/tick` - Process matching tick (scheduler)

### Channel

- `POST /v1/channel/:channelId/open` - Open a channel
- `POST /v1/channel/:channelId/messages` - Send a message
- `GET /v1/channel/:channelId/messages` - Get messages
- `POST /v1/channel/:channelId/close` - Close a channel

### Report

- `POST /v1/report` - Report a user

### Push

- `POST /v1/push/register` - Register push token
- `POST /v1/push/unregister` - Unregister push token

### Health

- `GET /health` - Health check

## WebSocket

WebSocket server is available at `/v1/ws`

### Client → Server Events

- `enqueue` - Enqueue a match request
- `cancel` - Cancel a match request
- `accept_offer` - Accept an offer
- `decline_offer` - Decline an offer
- `send_message` - Send a message
- `close_channel` - Close a channel

### Server → Client Events

- `queue_update` - Queue position update
- `offer_received` - New match offer
- `offer_timeout` - Offer expired
- `match_found` - Match found
- `match_declined` - Match declined
- `channel_opened` - Channel opened
- `message_received` - New message
- `channel_closed` - Channel closed
- `error` - Error occurred

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Middleware (rate limiting, validation, error handling)
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   ├── utils/           # Utilities
│   ├── websocket/       # WebSocket server and handlers
│   ├── app.ts           # Express app setup
│   └── index.ts         # Entry point
├── tests/               # Tests
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Rate Limiting

- **Enqueue**: 10 requests per minute per IP
- **Messages**: 60 messages per minute per channel
- **Reports**: 5 reports per hour per IP
- **General**: 100 requests per minute per IP

## Error Handling

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

## License

ISC
