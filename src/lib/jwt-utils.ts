/**
 * Decodes a JWT token without verification (to read payload only)
 * @param token - The JWT token string
 * @returns The decoded payload or null if invalid
 */
export const decodeJWT = (token: string): any | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

/**
 * Checks if a JWT token is expired
 * @param token - The JWT token string
 * @returns true if token is expired or invalid, false if valid
 */
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  const decoded = decodeJWT(token);
  console.log("decoded jwt :", decoded);
  if (decoded?.exp) {
    const expirationDate = new Date(decoded.exp * 1000);
    const now = new Date();
    const minutesRemaining = Math.round((expirationDate.getTime() - now.getTime()) / 60000);
    console.log(`decoded jwt exp (UTC): ${expirationDate.toUTCString()} (${minutesRemaining} minute(s) remaining)`);
  } else {
    console.log("decoded jwt exp : undefined");
  }
  console.log("decoded jwt exp time :", decoded?.exp * 1000);
  console.log("current time :", Date.now());
  console.log("expiration time :", decoded?.exp * 1000 - 5000);
  console.log("is expired :", Date.now() >= decoded?.exp * 1000 - 5000);
  if (!decoded || !decoded.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();

  // Add a small buffer (5 seconds) to account for clock skew
  return currentTime >= expirationTime - 5000;
};

/**
 * Checks if a JWT token is valid (exists and not expired)
 * @param token - The JWT token string
 * @returns true if token is valid, false otherwise
 */
export const isTokenValid = (token: string): boolean => {
  return !isTokenExpired(token);
};
