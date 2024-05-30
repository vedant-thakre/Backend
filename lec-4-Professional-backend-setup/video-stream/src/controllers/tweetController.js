import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweetModel.js";
import { User } from "../models/userModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { Response } from "../utils/responseHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if(!content) throw new ErrorHandler(400, "Cannot send empty tweet");

  const tweet = await Tweet.create({
    content,
    owner: req.user?._id,
  })

  if (!tweet) throw new ErrorHandler(400, "Error in creating tweet");

  return res
  .status(200)
  .json(
    new Response(200, tweet, "Tweet created Successfully")
  );
});

export const getUserTweets = asyncHandler(async (req, res) => {
  const allTweets = await Tweet.find({
    owner: req.user?._id,
  });

  if(!allTweets) throw new ErrorHandler(400, "No Tweets Found");

  return res
    .status(200)
    .json(new Response(200, allTweets, "Tweets fetched Successfully"));
});

export const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId, content } = req.body;
  
  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      content,
    },
    {
      new: true,
    }
  );

  if (!tweet) throw new ErrorHandler(400, "Error in updating tweet");

  return res
    .status(200)
    .json(new Response(200, tweet, "Tweet Updated Successfully"));
  
});

export const deleteTweet = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tweet = await Tweet.findByIdAndDelete(id);

  if (!tweet) throw new ErrorHandler(400, "Error in deleting the tweet");
  
  return res
    .status(200)
    .json(new Response(200, tweet, "Tweet Deleted Successfully"));
});

