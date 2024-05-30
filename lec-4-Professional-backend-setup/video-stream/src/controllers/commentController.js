import mongoose from "mongoose";
import { Comment } from "../models/commentModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { Response } from "../utils/responseHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});

export const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
});

export const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
});

export const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
});

