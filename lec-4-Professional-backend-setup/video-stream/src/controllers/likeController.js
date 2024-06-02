import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/likeModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { Response } from "../utils/responseHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { type } = req.query;

  const reaction = await Like.findOne({
    video: videoId,
    likedBy: req.user._id
  });

  if(!reaction){
    const like = await Like.create({
      video: videoId,
      likedBy: req.user._id,
      type: type,
    });

    return res
    .status(200)
    .json(
      new Response(200, like, `${type.charAt(0).toUpperCase() + type.slice(1)} added`)
    );
  }else{
    if(reaction.type !== type){
      existingLike.type = type;
      const updatedLike = await existingLike.save({ new: true});

      return res
        .status(200)
        .json(
          new Response(200, updatedLike, `${type.charAt(0).toUpperCase() + type.slice(1)} changed`)
        );
    }else{
      const removeLike = await Like.remove();
      return res
      .status(200)
      .json(
        new Response(200, removeLike, `${type.charAt(0).toUpperCase() + type.slice(1)} removed`)
      );
    }
  }
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

