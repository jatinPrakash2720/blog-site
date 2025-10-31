import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, _, next) => {
  
    let token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");
    
  console.log("token : ", token);
  token = token.trim();
    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
  }
  console.log("Updated token : ", token);
  console.log("access token secret : ", process.env.ACCESS_TOKEN_SECRET);
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    console.log("decodedToken : ", decodedToken);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  
});

export { verifyJWT };
