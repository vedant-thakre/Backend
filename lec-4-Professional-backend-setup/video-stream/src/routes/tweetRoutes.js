import express from "express";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import { createTweet, deleteTweet, getAllTweets, getTweetById, getUserTweets, updateTweet } from "../controllers/tweetController.js";

const router = express.Router();

// secured route
router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router.post("/add-tweet", createTweet);
router.patch("/update-tweet", updateTweet);
router.delete("/delete-tweet/:id", deleteTweet);
router.get("/get-tweet/:tweetId", getTweetById);
router.get("/get-all-tweets", getUserTweets);

// dev routes
router.get("/dev/test/getAllTweets", getAllTweets);


export default router;
