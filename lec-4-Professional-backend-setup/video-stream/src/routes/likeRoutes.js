import express from "express";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import { getLikedTweets, toggleTweetLike } from "../controllers/likeController.js";

const router = express.Router();

// secured route
router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router.post("/tweet-reaction/:tweetId", toggleTweetLike);
router.get("/liked-tweets/:userId", getLikedTweets);
// router.delete("/delete-tweet/:id", deleteTweet);
// router.get("/get-tweet/:tweetId", getTweetById);
// router.get("/get-all-tweets", getUserTweets);

// dev routes
// router.get("/dev/test/getAllTweets", getAllTweets);

export default router;
