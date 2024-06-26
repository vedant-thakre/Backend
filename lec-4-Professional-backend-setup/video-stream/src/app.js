// importing packages
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

// importing Routes
import userRoutes from './routes/userRoutes.js';
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import tweetRoutes from "./routes/tweetRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";

const app = express();

// middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb"}));
app.use(express.static("public")) // storing the static assets in the public folder
app.use(cookieParser());

// routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/subscription", subscriptionRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);


export { app };