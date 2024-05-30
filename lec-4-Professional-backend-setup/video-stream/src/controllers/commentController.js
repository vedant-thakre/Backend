import mongoose from "mongoose";
import { Comment } from "../models/commentModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { Response } from "../utils/responseHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllComments = asyncHandler(async (req, res) => {
  const { videoId, tweetId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId && !tweetId) throw new ErrorHandler(404, "Id is Required");

  let post = {};
  let type;
  if (videoId) {
    post.video = new mongoose.Types.ObjectId(videoId);
    type = "video";
  } else if (tweetId){
    post.tweet = new mongoose.Types.ObjectId(tweetId);
    type = "tweet";
  }


  const allComments = await Comment.aggregate([
    {
      $match: post,
    },
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
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$userInfo"
    }
    // {
    //   $addFields: {
    //     userData: {
    //       $first: "$userInfo",
    //     },
    //   },
    // },
    // {
    //   $project: {
    //     userInfo: 0,
    //   },
    // },
  ]);

  if(!allComments.length ) throw new ErrorHandler(400, `This ${type} does not have any comments`);

   return res
     .status(201)
     .json(new Response(200, allComments, "Comment fetched Successfully"));

});

export const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { videoId, tweetId } = req.params;

  if(!content) throw new ErrorHandler(404, "Comment cannot be emtpy");

  if(!videoId && !tweetId) throw new ErrorHandler(404, "Id is Required");
  
  const comment = await Comment.create({
    content,
    owner: req.user?._id,
    video: videoId || null,
    tweet: tweetId || null,
  });

  if (!comment) throw new ErrorHandler(404, "Error in adding comment");

  return res
    .status(201)
    .json(new Response(200, comment, "Comment created Successfully"));
  
});

export const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      content,
    },
    {
      new: true,
    }
  );

   if (!comment) throw new ErrorHandler(400, "Error in updating comment");

   return res
     .status(200)
     .json(new Response(200, comment, "Comment Updated Successfully"));
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Tweet.findByIdAndDelete(id);

  if (!comment) throw new ErrorHandler(400, "Error in deleting the tweet");

  return res
    .status(200)
    .json(new Response(200, comment, "Comment Deleted Successfully"));
});

