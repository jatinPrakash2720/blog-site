import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { User } from "../models/user.model.js";
import { generateAccessAndRefreshToken } from "../utils/genAccessAndRefreshToken.util.js";
import jwt from "jsonwebtoken";

// Cookie options for setting tokens
const cookieOptions = {
  httpOnly: true,
  secure: true,
};

/**
 * JWT Verification Middleware with Automatic Token Refresh
 *
 * Handles all JWT verification errors according to the jwt.verify() internal flow:
 * 1. Valid token → Returns decoded payload
 * 2. Wrong secret → JsonWebTokenError: invalid signature
 * 3. Expired token → TokenExpiredError (with err.expiredAt) → Auto-refresh if refreshToken available
 * 4. Future token (nbf) → NotBeforeError (with err.date)
 * 5. Wrong algorithm → JsonWebTokenError: invalid algorithm
 * 6. Malformed token → JsonWebTokenError: jwt malformed
 */
const verifyJWT = asyncHandler(async (req, res, next) => {
  // Extract token from cookies or Authorization header
  let token = req.cookies?.accessToken;

  // If no token in cookies, try Authorization header
  if (!token) {
    const authHeader = req.header("Authorization");
    if (authHeader) {
      // Extract token from "Bearer <token>" format
      // Handle various formats: "Bearer <token>", "bearer <token>", "BEARER <token>", etc.
      const parts = authHeader.trim().split(/\s+/);
      if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
        token = parts[1];
      } else if (parts.length === 1) {
        // If no "Bearer" prefix, assume the entire header is the token
        token = parts[0];
      }
    }
  }

  // Log token extraction for debugging
  console.log("🔑 [Auth Middleware] Token extraction:", {
    fromCookie: !!req.cookies?.accessToken,
    fromHeader: !!req.header("Authorization"),
    tokenLength: token?.length || 0,
    tokenPreview: token ? token : "no token",
    tokenIsEmpty:
      !token || token.trim() === "" || token === '""' || token === "null",
  });

  // Check if token exists and is valid (not empty string or "null")
  const isTokenEmpty =
    !token || token.trim() === "" || token === '""' || token === "null";

  if (isTokenEmpty) {
    console.log(
      "⚠️ [Auth Middleware] Token is empty or invalid, checking for refresh token..."
    );

    // If token is empty/invalid but we have refresh token, try to refresh
    const refreshToken =
      req.cookies?.refreshToken ||
      req.body?.refreshToken ||
      req.header("X-Refresh-Token") ||
      req.header("x-refresh-token") ||
      req.header("Refresh-Token") ||
      req.header("refresh-token") ||
      req.get("X-Refresh-Token") ||
      req.get("x-refresh-token");

    if (refreshToken) {
      console.log(
        "🔄 [Auth Middleware] Empty/invalid access token, attempting refresh..."
      );
      // Skip token verification and go directly to refresh logic
      // We'll create a fake expired error to trigger refresh flow
      const fakeError = new jwt.TokenExpiredError(
        "Token is empty/invalid, attempting refresh",
        new Date()
      );
      throw fakeError;
    } else {
      throw new ApiError(401, "Unauthorized Request: Token not provided");
    }
  }

  // Clean the token (remove whitespace)
  token = token.trim();

  // Verify token secret is configured
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new ApiError(
      500,
      "Server Configuration Error: ACCESS_TOKEN_SECRET not set"
    );
  }

  try {
    // Verify and decode the token
    // This will throw specific errors for different failure cases
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Check if decoded token has required _id field
    if (!decodedToken?._id) {
      throw new ApiError(401, "Invalid Access Token: Missing user identifier");
    }

    // Find user by ID from token
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    // Check if user exists
    if (!user) {
      throw new ApiError(401, "Invalid Access Token: User not found");
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    // Log the error for debugging
    console.log("🔍 [Auth Middleware] JWT Verification Error:", {
      errorName: error.name,
      errorMessage: error.message,
      isTokenExpiredError: error instanceof jwt.TokenExpiredError,
      isJsonWebTokenError: error instanceof jwt.JsonWebTokenError,
      isNotBeforeError: error instanceof jwt.NotBeforeError,
    });

    // Handle JWT-specific errors
    // IMPORTANT: Check TokenExpiredError FIRST before JsonWebTokenError
    // because TokenExpiredError extends JsonWebTokenError

    // Handle malformed/invalid tokens - try to refresh if refresh token is available
    if (
      error instanceof jwt.JsonWebTokenError &&
      error.message === "jwt malformed"
    ) {
      console.log(
        "⚠️ [Auth Middleware] JWT malformed, checking for refresh token..."
      );

      // Check for refresh token
      let refreshToken =
        req.cookies?.refreshToken ||
        req.body?.refreshToken ||
        req.header("X-Refresh-Token") ||
        req.header("x-refresh-token") ||
        req.header("Refresh-Token") ||
        req.header("refresh-token") ||
        req.get("X-Refresh-Token") ||
        req.get("x-refresh-token");

      if (refreshToken) {
        console.log(
          "🔄 [Auth Middleware] Malformed access token, attempting refresh with refresh token..."
        );
        // Fall through to refresh logic (will be handled below)
        // We'll treat this like an expired token and try to refresh
        error = new jwt.TokenExpiredError(
          "Token is malformed, attempting refresh",
          new Date()
        );
      } else {
        throw new ApiError(
          401,
          "Invalid Access Token: Token format is invalid"
        );
      }
    }

    if (error instanceof jwt.TokenExpiredError) {
      console.log("⏰ [Auth Middleware] Token expired, attempting refresh...");
      try {
        // Check for refresh token in cookies, request body, or custom header
        // Since tokens are stored in localStorage (not cookies), check multiple sources
        // Check refresh token from multiple sources
        // Note: Express headers are case-insensitive, but we check both formats
        let refreshToken =
          req.cookies?.refreshToken ||
          req.body?.refreshToken ||
          req.header("X-Refresh-Token") ||
          req.header("x-refresh-token") ||
          req.header("Refresh-Token") ||
          req.header("refresh-token") ||
          req.get("X-Refresh-Token") ||
          req.get("x-refresh-token");

        console.log("🔑 [Auth Middleware] Refresh token check:", {
          fromCookie: !!req.cookies?.refreshToken,
          fromBody: !!req.body?.refreshToken,
          fromXHeader: !!req.header("X-Refresh-Token"),
          fromXHeaderLower: !!req.header("x-refresh-token"),
          hasRefreshToken: !!refreshToken,
          allHeaders: Object.keys(req.headers),
          headerKeys: Object.keys(req.headers).filter(
            (h) =>
              h.toLowerCase().includes("refresh") ||
              h.toLowerCase().includes("x-")
          ),
        });

        if (!refreshToken) {
          // Clear cookies if no refresh token found
          console.log(
            "❌ [Auth Middleware] No refresh token found, clearing cookies"
          );
          res.clearCookie("accessToken", cookieOptions);
          res.clearCookie("refreshToken", cookieOptions);

          throw new ApiError(
            401,
            `Access Token Expired: Token expired at ${new Date(error.expiredAt).toISOString()}. No refresh token found to renew access.`
          );
        }

        // Verify refresh token secret is configured
        if (!process.env.REFRESH_TOKEN_SECRET) {
          throw new ApiError(
            500,
            "Server Configuration Error: REFRESH_TOKEN_SECRET not set"
          );
        }

        // Verify the refresh token
        let decodedRefreshToken;
        console.log("🔑 [Auth Middleware] Refresh token:", refreshToken);
        try {
          decodedRefreshToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
          );
          console.log(
            "🔑 [Auth Middleware] Decoded refresh token:",
            decodedRefreshToken
          );
        } catch (refreshError) {
          // Handle refresh token verification errors
          if (refreshError instanceof jwt.JsonWebTokenError) {
            // Clear cookies on invalid refresh token
            console.log(
              "❌ [Auth Middleware] Refresh token invalid, clearing cookies"
            );
            res.clearCookie("accessToken", cookieOptions);
            res.clearCookie("refreshToken", cookieOptions);
            throw new ApiError(
              401,
              "Refresh Token Invalid: Token signature verification failed"
            );
          }
          if (refreshError instanceof jwt.TokenExpiredError) {
            // Clear cookies on expired refresh token
            console.log(
              "❌ [Auth Middleware] Refresh token expired, clearing cookies"
            );
            res.clearCookie("accessToken", cookieOptions);
            res.clearCookie("refreshToken", cookieOptions);
            throw new ApiError(
              401,
              `Refresh Token Expired: Token expired at ${new Date(refreshError.expiredAt).toISOString()}`
            );
          }
          if (refreshError instanceof jwt.NotBeforeError) {
            throw new ApiError(
              401,
              `Refresh Token Not Yet Valid: Token will be valid from ${new Date(refreshError.date).toISOString()}`
            );
          }
          // Clear cookies on other refresh token errors
          console.log(
            "❌ [Auth Middleware] Refresh token invalid, clearing cookies"
          );
          res.clearCookie("accessToken", cookieOptions);
          res.clearCookie("refreshToken", cookieOptions);
          throw new ApiError(401, "Refresh Token Invalid");
        }

        // Find user by ID from refresh token
        const user = await User.findById(decodedRefreshToken?._id);
        if (!user) {
          throw new ApiError(401, "Refresh Token Invalid: User not found");
        }

        // Verify refresh token matches stored token in database
        if (refreshToken !== user.refreshToken) {
          throw new ApiError(
            401,
            "Refresh Token Invalid: Token does not match stored token"
          );
        }

        // Generate new access and refresh tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          await generateAccessAndRefreshToken(decodedRefreshToken._id);

        console.log("🔄 [Auth Middleware] New tokens generated:", {
          newAccessToken: newAccessToken,
          newAccessTokenLength: newAccessToken?.length || 0,
          newRefreshToken: newRefreshToken,
          newRefreshTokenLength: newRefreshToken?.length || 0,
          userId: decodedRefreshToken._id,
          timestamp: new Date().toISOString(),
        });

        // Set new tokens in cookies (for cookie-based auth)
        console.log("🍪 [Auth Middleware] Setting cookies with options:", {
          cookieOptions: cookieOptions,
          accessTokenLength: newAccessToken?.length || 0,
          refreshTokenLength: newRefreshToken?.length || 0,
        });

        res.cookie("accessToken", newAccessToken, cookieOptions);
        res.cookie("refreshToken", newRefreshToken, cookieOptions);

        console.log("✅ [Auth Middleware] Cookies set successfully:", {
          accessTokenCookieSet: true,
          refreshTokenCookieSet: true,
          cookieOptions: cookieOptions,
        });

        // Also set tokens in response headers so frontend can update localStorage
        res.setHeader("X-New-Access-Token", newAccessToken);
        res.setHeader("X-New-Refresh-Token", newRefreshToken);

        console.log("📤 [Auth Middleware] Response headers set:", {
          xNewAccessTokenHeader: true,
          xNewRefreshTokenHeader: true,
        });

        // Find user by ID from refresh token (we already validated the user exists)
        const refreshedUser = await User.findById(
          decodedRefreshToken._id
        ).select("-password -refreshToken");

        if (!refreshedUser) {
          throw new ApiError(401, "Failed to refresh: User not found");
        }

        // Attach user to request object and continue
        req.user = refreshedUser;
        console.log(
          "✅ [Auth Middleware] Token refreshed successfully, continuing request..."
        );
        next();
        return;
      } catch (refreshError) {
        // If refresh fails, clear cookies before throwing error
        console.log(
          "❌ [Auth Middleware] Token refresh failed, clearing cookies"
        );
        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);

        // If refresh fails, throw the original expired error or refresh error
        if (refreshError instanceof ApiError) {
          throw refreshError;
        }
        // Fall back to original expired error if refresh attempt fails
        throw new ApiError(
          401,
          `Access Token Expired: Token expired at ${new Date(error.expiredAt).toISOString()}. Failed to refresh token: ${refreshError.message}`
        );
      }
    }

    // Case: NotBeforeError (token not yet valid - nbf check failed)
    if (error instanceof jwt.NotBeforeError) {
      throw new ApiError(
        401,
        `Access Token Not Yet Valid: Token will be valid from ${new Date(error.date).toISOString()}`
      );
    }

    // Handle other JsonWebTokenError cases (must come after TokenExpiredError)
    if (error instanceof jwt.JsonWebTokenError) {
      // Case: JsonWebTokenError (invalid signature, invalid algorithm, jwt malformed)
      let errorMessage = "Invalid Access Token";

      if (error.message === "invalid signature") {
        errorMessage =
          "Invalid Access Token: Token signature verification failed";
      } else if (error.message === "invalid algorithm") {
        errorMessage = "Invalid Access Token: Token algorithm not supported";
      } else if (error.message === "jwt malformed") {
        errorMessage = "Invalid Access Token: Token format is invalid";
      } else if (error.message.includes("Unexpected token")) {
        errorMessage = "Invalid Access Token: Token structure is invalid";
      }

      throw new ApiError(401, errorMessage);
    }

    // If error is already an ApiError, re-throw it
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle any other unexpected errors
    throw new ApiError(
      500,
      `Token Verification Error: ${error.message || "Unknown error occurred"}`
    );
  }
});

export { verifyJWT };
