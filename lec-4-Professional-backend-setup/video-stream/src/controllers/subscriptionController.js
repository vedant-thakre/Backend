import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/userModel.js";
import { Subscription } from "../models/subscriptionModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { Response } from "../utils/responseHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addSubscription = asyncHandler(async (req, res) => {    
  const { channelId } = req.params;

  if(!channelId) throw new ErrorHandler(404, "Invalide channel Id");

  const subscriber = await Subscription.create({
    subscriber: req.user?._id,
    channel: channelId
  })

  if(!subscriber) throw new ErrorHandler(404, "Error in subscribing channel"); 

  return res
  .status(200)
  .json(
    new Response(200, subscriber, "Channel subscribed successfully")
  )
});

// controller to return subscriber list of a channel
export const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  
  if (!channelId) throw new ErrorHandler(404, "Invalide channel Id");

  const subscribersList = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscribers",
      },
    },
    {
      $addFields: {
        subArray: {
          $first: "$subscribers",
        },
      },
    },
    // {
    //   $unwind: {
    //     path: "$subscribers",
    //   },
    // },
    {
      $replaceRoot: {
        newRoot: "$subArray",
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        avatar: 1,
      },
    },
  ]);
  

  if(!subscribersList ) throw new ErrorHandler(400, "This channel does not have any subscribers");

  return res
    .status(200)
    .json(new Response(200, subscribersList, "Subscribers fetched successfully"));
});

// controller to return channel list to which user has subscribed
export const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId) throw new ErrorHandler(404, "Invalid User Id");
  
  const channelList = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelList",
      },
    },
    {
      $addFields: {
        channels: {
          $first: "$channelList",
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: "$channels",
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        avatar: 1,
      },
    },
  ]);
    
  if(!channelList ) throw new ErrorHandler(400, "This user did not subscribed to any channel");

  return res
    .status(200)
    .json(new Response(200, channelList, "Channels fetched successfully"));
});

// controller to unsusbscribe the channel
export const unsusbscribeChannel = asyncHandler(async(req, res) => {
  const { channelId } = req.params;

  const unsusbscribe = await Subscription.deleteOne({
    channel: channelId,
    subscriber: req.user?._id
  });

  if(!unsusbscribe ) throw new ErrorHandler(400, "Error in unsubscribing channel");

  return res
    .status(200)
    .json(new Response(200, {}, "Channel Unsubscribed successfully"));
});
