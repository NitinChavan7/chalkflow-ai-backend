# ChalkFlow AI backend

ChalkFlow AI is an interactive whiteboard tutor for students learning programming. This API generates structured lessons and diagrams, answers lesson-focused follow-up questions, and generates and grades multiple-choice quizzes. A frontend can render the diagrams with React Flow.

## Stack and architecture

Node.js, Express, MongoDB/Mongoose, Groq, Zod, Helmet and express-rate-limit; CommonJS modules. Feature controllers handle HTTP, services contain business logic, and repositories handle persistence. See [architecture](docs/ARCHITECTURE.md) and [API reference](docs/API.md).

```text
config/              MongoDB and Groq configuration
middleware/          errors, 404 and rate limiting
modules/lesson/      lesson generation and retrieval
modules/tutor/       contextual conversations
modules/quiz/        quiz generation and grading
modules/health/      liveness endpoint
utils/               validation, AI JSON and error helpers
docs/                architecture and API reference
__tests__/           automated tests
app.js               Express application
server.js            configuration validation and startup
```

## Installation

Requires Node.js 20+, npm, MongoDB, and a Groq API key.

```sh
npm install
```

Copy `.env.example` to `.env` and set these variables:

| Variable | Purpose |
| --- | --- |
| PORT | HTTP port; defaults to 3000 |
| MONGODB_URI | MongoDB connection URI |
| GROQ_API_KEY | Server-side Groq API key |
| GROQ_MODEL | Groq model supporting JSON object mode |
| CLIENT_URL | Allowed frontend origin; comma-separated for multiple origins |

```sh
npm run dev
npm start
npm test
```

The server validates configuration and connects to MongoDB before listening. Tests mock AI and repositories and need neither MongoDB nor a Groq key.

## API

- `GET /api/health`
- `POST /api/lessons/generate` and `GET /api/lessons/:id`
- `POST /api/tutor/ask`
- `POST /api/quiz/generate` and `POST /api/quiz/submit`

Example request:

```sh
curl -X POST http://localhost:3000/api/lessons/generate -H "Content-Type: application/json" -d '{"topic":"JavaScript Event Loop","level":"beginner"}'
```

See the [API reference](docs/API.md) for complete bodies and responses. Successful responses contain `success`, `message`, and `data`; failures contain `success: false` and `message` with an appropriate HTTP status.

## AI and security

The server sends bounded user input and lesson context to Groq. It requests JSON, validates the result, and retries invalid output once. Groq requests time out after 30 seconds. AI endpoints are rate-limited; request bodies and text fields have limits, CORS is configurable, and Helmet sets security headers. Prompts instruct the model to treat supplied text as data, and generated diagrams are validated. These measures reduce prompt injection risk but cannot guarantee prevention or factual accuracy. Review generated material before relying on it.

## Limitations

There is no authentication or authorization: anyone with access to the API and an ID can access associated data. Deploy behind suitable access controls. Rate limiting is per process and in memory. Tutor updates are validated against the original lesson diagram, not a persisted evolving board. Conversations and quizzes are stored without retention limits. Health reports process liveness, not database or Groq readiness. External service availability and model output quality are not guaranteed.
