import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import { ConnectDB } from './db/db.js';
import { app } from './app.js';

dotenv.config();
const PORT = process.env.PORT || 4040;

ConnectDB()
.then(() => {
    app.listen(PORT, () => {
      console.log(`Server is Running on PORT ${PORT}`.yellow.bold);
    });
})
.catch((err) => {
    console.log(`MongoDB Connection Failed : `, err);
})

app.use('/', (req, res) => {
    res.send("Video Streaming Server is Live");
});

