import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.get("/github/:id", async (req, res) => {
    const id = req.params.id;

    const response = await axios.get(`${process.env.URL}/${id}`);

    res.status(200).json({
        success: true,
        message: 'Data fetched sucessfully',
        data: response.data
    })
}) 



app.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`);
})