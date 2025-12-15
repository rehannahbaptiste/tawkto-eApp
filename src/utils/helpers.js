/**
 * Generate a random ID with a prefix
 * @param {string} prefix - The prefix for the ID (e.g., 'sel', 'usr')
 * @param {number} length - Length of the random part (default: 8)
 * @returns {string} Generated ID
 */
export function generateId(prefix = 'id', length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let random = '';
  for (let i = 0; i < length; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${random}`;
}

/**
 * Format error response
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {any} details - Optional error details
 * @returns {object} Formatted error object
 */
export function formatError(code, message, details = null) {
  const error = { code, message };
  if (details) {
    error.details = details;
  }
  return error;
}
