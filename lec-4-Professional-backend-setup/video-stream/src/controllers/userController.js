import { asyncHandler } from "../utils/asyncHandler.js";

// Register a user
export const registerUser = asyncHandler(async(req, res)=>{
    res.status(200).json({
        message: "ok"
    });
});