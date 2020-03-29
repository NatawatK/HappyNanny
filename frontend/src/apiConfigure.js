export const BACKEND_PATH =
  // http://localhost:9900 can replace with "/api" or "backend" if run with docker-compose
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:9900";
