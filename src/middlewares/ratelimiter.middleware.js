// import rateLimit from "express-rate-limit";

// export const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000, //Limit each IP to 1000 requests per window
//   message: "Too many requests from this IP, please try again after 15 minutes",
//   standardHeaders: true, // Return rate limit info in the `<RateLimit-*`
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

// export const authLimiter = rateLimit({
//   windowMs: 10 * 60 * 1000, //10 minutes
//   max: 100,
//   message: "Too many authentication attempts, please try agan after 10 minutes",
//   standardHeaders: true,
//   legacyHeaders: false,
// });
