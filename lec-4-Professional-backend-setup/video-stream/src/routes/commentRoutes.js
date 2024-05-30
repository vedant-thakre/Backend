import express from "express";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import { addComment, deleteComment, getAllComments, updateComment } from "../controllers/commentController.js";


const router = express.Router();

// secured route
router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router.post("/add-comment/video/:videoId", addComment);
router.post("/add-comment/tweet/:tweetId", addComment);
router.patch("/update-comment/:commentId", updateComment);
router.delete("/delete-tweet/:commentId", deleteComment);
router.get("/get-all-comments-for-video/:videoId", getAllComments);
router.get("/get-all-comments-for-tweet/:tweetId", getAllComments);

export default router;
