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
      const removeLike = await Like.deleteOne();
      return res
      .status(200)
      .json(
        new Response(200, removeLike, `${type.charAt(0).toUpperCase() + type.slice(1)} removed`)
      );
    }
  }
});

export const toggleCommentLike = asyncHandler(async (req, res) => {
   const { commentId } = req.params;
   const { type } = req.query;

   const reaction = await Like.findOne({
     comment: commentId,
     likedBy: req.user._id,
   });

   if (!reaction) {
     const like = await Like.create({
       comment: commentId,
       likedBy: req.user._id,
       type: type,
     });

     return res
       .status(200)
       .json(
         new Response(
           200,
           like,
           `${type.charAt(0).toUpperCase() + type.slice(1)} added`
         )
       );
   } else {
     if (reaction.type !== type) {
       existingLike.type = type;
       const updatedLike = await existingLike.save({ new: true });

       return res
         .status(200)
         .json(
           new Response(
             200,
             updatedLike,
             `${type.charAt(0).toUpperCase() + type.slice(1)} changed`
           )
         );
     } else {
       const removeLike = await Like.deleteOne();
       return res
         .status(200)
         .json(
           new Response(
             200,
             removeLike,
             `${type.charAt(0).toUpperCase() + type.slice(1)} removed`
           )
         );
     }
   }
});

export const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { type } = req.query;

  const reaction = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  if (!reaction) {
    const like = await Like.create({
      tweet: tweetId,
      likedBy: req.user._id,
      type: type,
    });

    return res
      .status(200)
      .json(
        new Response(
          200,
          like,
          `${type.charAt(0).toUpperCase() + type.slice(1)} added`
        )
      );
  } else {
    if (reaction.type !== type) {
      existingLike.type = type;
      const updatedLike = await existingLike.save({ new: true });

      return res
        .status(200)
        .json(
          new Response(
            200,
            updatedLike,
            `${type.charAt(0).toUpperCase() + type.slice(1)} changed`
          )
        );
    } else {
      const removeLike = await Like.deleteOne();
      return res
        .status(200)
        .json(
          new Response(
            200,
            removeLike,
            `${type.charAt(0).toUpperCase() + type.slice(1)} removed`
          )
        );
    }
  }
});

export const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const { id } = req.params;

  const videos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(id)
      }
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideos"
      }
    }
  ]);
});

export const getLikedTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { type } = req.query;

  const tweets = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        type: type,
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "tweet",
        foreignField: "_id",
        as: "likedTweet",
        pipeline: [
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
        ],
      },
    },
    {
      $unwind: "$likedTweet",
    },
    {
      $project: {
        _id: "$likedTweet._id",
        content: "$likedTweet.content",
        createdAt: "$likedTweet.createdAt",
        updatedAt: "$likedTweet.updatedAt",
        owner: "$likedTweet.user",
      },
    },
  ]);


  return res
    .status(200)
    .json(
      new Response( 200, tweets, "Tweets fetched Successfully")
    );
  
});

export const getLikedComments = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

