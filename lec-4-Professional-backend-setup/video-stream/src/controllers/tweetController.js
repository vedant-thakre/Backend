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

export const getTweetById = asyncHandler(async(req, res) => {
  const{ tweetId } = req.params;

  const tweet = await Tweet.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(tweetId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              fullName: 1,
              avatar: 1,
              username: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$user",
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "tweet",
        as: "comments",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "userInfo",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    avatar: 1,
                    username: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$userInfo",
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(new Response(200, tweet, "Tweet fetched Successfully"));
});

export const getAllTweets = asyncHandler(async(req, res) => {
  const tweets = await Tweet.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 1,
        content: 1,
        createdAt: 1,
        updatedAt: 1,
        owner: "$user",
      },
    },
  ]);
  return res
    .status(200)
    .json(new Response(200, tweets, "Tweets fetched Successfully"));
})