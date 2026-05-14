import express, { json } from "express";
import mongoose from "mongoose";
import getGroqResponse from "./utils/groq.js";
import chatRoutes from "./routes/chat.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/api/v1", chatRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    main();
});

const main = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to DB!");
    }).catch((err) => {
        console.log(err);
    });
}