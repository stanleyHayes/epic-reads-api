import cors from "cors";
import dotenv from "dotenv";
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import expressSanitizer from "express-sanitizer";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("MongoDB Connected");
}).catch(error => {
    console.log(`Error connecting to MongoDB: ${error}`);
});

import bookV1Routes from "./routes/v1/users/book.routes.js";
import authV1Routes from "./routes/v1/users/auth.routes.js";

const app = express();
// helps to transform the request body and makes
// it available on the req.body
app.use(expressSanitizer());
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use("/api/v1/books", bookV1Routes);
app.use("/api/v1/auth", authV1Routes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});