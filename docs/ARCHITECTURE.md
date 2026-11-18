# Architecture

React frontend → Express API → controller → service → Groq AI / repository → MongoDB → API response → React Flow whiteboard.

The central router mounts feature routers. Controllers translate HTTP requests and responses; services orchestrate AI calls and business rules; repositories isolate Mongoose queries. Model files define persistence schemas. Zod validates incoming bodies and AI output, including diagram references. Express middleware handles security headers, CORS, request size, logging, rate limits, missing routes, and errors.

Startup loads environment variables, validates required settings, connects to MongoDB, and only then starts listening. Groq is created lazily with a timeout. Lesson generation saves a validated graph. Tutor requests include the original lesson and the most recent ten conversation messages; a validated update is returned for the frontend to apply. Quiz generation stores answer keys and explanations while returning only questions and options; submission grades server-side.
