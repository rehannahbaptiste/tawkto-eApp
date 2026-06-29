// src/middleware/apiKeyAuth.js

export function apiKeyAuth(req, res, next) {
  const providedKey = req.header("x-api-key");
  const expectedKey = process.env.TAWK_TOOL_API_KEY;

  if (!expectedKey) {
    return res.status(500).json({
      error: "Server API key is not configured",
    });
  }

  if (!providedKey || providedKey !== expectedKey) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  next();
}