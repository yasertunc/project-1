import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { resolve } from "node:path";

const DEFAULT_PORT = 5080;
const DEFAULT_STATIC_DIR = resolve(process.cwd(), "storybook-static");

const PORT = Number.parseInt(process.env.PORT ?? `${DEFAULT_PORT}`, 10);
const STATIC_DIR = resolve(process.env.STATIC_DIR ?? DEFAULT_STATIC_DIR);

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions =
  allowedOrigins.length > 0
    ? {
        origin: allowedOrigins,
        credentials: true,
      }
    : {
        origin: true,
        credentials: true,
      };

const app = express();
app.set("trust proxy", true);

app.use(cors(corsOptions));

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "data:", "https://*"],
        "script-src": ["'self'", "'unsafe-inline'"],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
        "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  rateLimit({
    windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW ?? "60000", 10),
    max: Number.parseInt(process.env.RATE_LIMIT_MAX ?? "60", 10),
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "interest-cohort=()");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});

app.use(
  express.static(STATIC_DIR, {
    cacheControl: true,
    maxAge: "1h",
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);

app.get("*", (req, res, next) => {
  if (req.accepts("html")) {
    res.sendFile(resolve(STATIC_DIR, "index.html"), (err) => {
      if (err) next(err);
    });
  } else {
    next();
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error("Secure server error:", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(
    `[secure-server] Serving ${STATIC_DIR} on http://localhost:${PORT}`
  );
});
