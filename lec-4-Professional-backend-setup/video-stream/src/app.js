import express from 'express';
import cors from 'cors';
import cookieParser, { CookieParser} from 'cookie-parser';

const app = express();

// middlewares
app.use({
    origin: process.env.CORS_ORIGIN,
    credentials: true
});
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ exptended: true, limit: "16kb"}));
app.use(express.static("public")) // storing the static assets in the public folder
app.use(cookieParser());


export { app };