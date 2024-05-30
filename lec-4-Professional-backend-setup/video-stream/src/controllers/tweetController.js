import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweetModel.js";
import { User } from "../models/userModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { Response } from "../utils/responseHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
});

export const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
});

export const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
});

export const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
});

