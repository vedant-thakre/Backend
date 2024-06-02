import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/likeModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { Response } from "../utils/responseHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { type } = req.body; // 'like' or 'dislike'
  const userId = req.user._id; // Assuming you have a middleware to authenticate user and attach user info to req object

  if (!['like', 'dislike'].includes(type)) {
    return res.status(400).json({ message: 'Invalid type' });
  }

  // Check if the like or dislike already exists
  const existingLike = await Like.findOne({ likedBy: userId, video: videoId });

  if (existingLike) {
    if (existingLike.type === type) {
      // If it exists and the type matches, remove it (toggle off)
      await existingLike.remove();
      res.status(200).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} removed` });
    } else {
      // If it exists but the type does not match, update the type
      existingLike.type = type;
      await existingLike.save();
      res.status(200).json({ message: `Changed to ${type}` });
    }
  } else {
    // If it doesn't exist, create it (toggle on)
    const newLike = new Like({
      likedBy: userId,
      video: videoId,
      type: type
    });
    await newLike.save();
    res.status(200).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} added` });
  }
});

export const toggleCommentLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { type } = req.body; // 'like' or 'dislike'
  const userId = req.user._id; // Assuming you have a middleware to authenticate user and attach user info to req object

  if (!["like", "dislike"].includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  // Check if the like or dislike already exists
  const existingLike = await Like.findOne({ likedBy: userId, video: videoId });

  if (existingLike) {
    if (existingLike.type === type) {
      // If it exists and the type matches, remove it (toggle off)
      await existingLike.remove();
      res
        .status(200)
        .json({
          message: `${type.charAt(0).toUpperCase() + type.slice(1)} removed`,
        });
    } else {
      // If it exists but the type does not match, update the type
      existingLike.type = type;
      await existingLike.save();
      res.status(200).json({ message: `Changed to ${type}` });
    }
  } else {
    // If it doesn't exist, create it (toggle on)
    const newLike = new Like({
      likedBy: userId,
      video: videoId,
      type: type,
    });
    await newLike.save();
    res
      .status(200)
      .json({
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} added`,
      });
  }
});

export const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
});

export const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

