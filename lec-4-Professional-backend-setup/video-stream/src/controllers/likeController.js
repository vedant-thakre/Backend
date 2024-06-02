import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/likeModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { Response } from "../utils/responseHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const toggleVideoLike = asyncHandler(async (req, res) => {
 
});

export const toggleCommentLike = asyncHandler(async (req, res) => {
 
});

export const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  
  // const tweet = await 
});

export const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

